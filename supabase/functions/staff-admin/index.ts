import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const authorization = request.headers.get('Authorization');

    if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) {
      return json({ error: 'Unauthorized.' }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return json({ error: 'Your session is invalid or has expired.' }, 401);
    }

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('role, is_active')
      .eq('id', userData.user.id)
      .single();

    if (profileError || profile?.role !== 'admin' || !profile?.is_active) {
      return json({ error: 'Administrator access is required.' }, 403);
    }

    const body = await request.json();
    const action = String(body.action || '');

    if (action === 'list') {
      const { data: authData, error: authError } = await adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (authError) throw authError;

      const { data: profiles, error: profilesError } = await adminClient
        .from('profiles')
        .select('id, email, full_name, role, is_active');
      if (profilesError) throw profilesError;

      const profilesById = new Map((profiles || []).map((item) => [item.id, item]));
      const users = authData.users.map((user) => {
        const staff = profilesById.get(user.id);
        return {
          id: user.id,
          email: user.email || staff?.email || '',
          full_name: staff?.full_name || user.user_metadata?.full_name || user.email || '',
          role: staff?.role || 'staff',
          is_active: staff?.is_active ?? true,
          last_sign_in_at: user.last_sign_in_at,
        };
      });

      return json({ users });
    }

    if (action === 'invite') {
      const email = String(body.email || '').trim().toLowerCase();
      const name = String(body.name || '').trim();
      const redirectTo = String(body.redirectTo || '');
      const requestOrigin = request.headers.get('Origin');

      if (!email || !name) return json({ error: 'Name and email are required.' }, 400);
      if (!requestOrigin || new URL(redirectTo).origin !== requestOrigin) {
        return json({ error: 'Invalid invitation redirect.' }, 400);
      }

      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        data: { full_name: name },
        redirectTo,
      });
      if (error) throw error;

      return json({ userId: data.user.id });
    }

    const targetUserId = String(body.userId || '');
    if (!targetUserId) return json({ error: 'A staff account is required.' }, 400);
    if (targetUserId === userData.user.id) {
      return json({ error: 'You cannot change or deactivate your own administrator account.' }, 400);
    }

    if (action === 'deactivate' || action === 'reactivate') {
      const isActive = action === 'reactivate';
      const { error: authError } = await adminClient.auth.admin.updateUserById(targetUserId, {
        ban_duration: isActive ? 'none' : '876000h',
      });
      if (authError) throw authError;

      const { error: updateError } = await adminClient
        .from('profiles')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', targetUserId);
      if (updateError) throw updateError;

      return json({ success: true });
    }

    if (action === 'delete') {
      const { data: targetProfile, error: targetProfileError } = await adminClient
        .from('profiles')
        .select('role, is_active')
        .eq('id', targetUserId)
        .single();
      if (targetProfileError) throw targetProfileError;

      if (targetProfile?.role === 'admin' && targetProfile.is_active) {
        const { count, error: countError } = await adminClient
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'admin')
          .eq('is_active', true);
        if (countError) throw countError;
        if ((count || 0) <= 1) {
          return json({ error: 'You cannot delete the last active administrator.' }, 400);
        }
      }

      const { error } = await adminClient.auth.admin.deleteUser(targetUserId);
      if (error) throw error;

      return json({ success: true });
    }

    if (action === 'set-role') {
      const role = String(body.role || '');
      if (!['staff', 'admin'].includes(role)) {
        return json({ error: 'Invalid staff role.' }, 400);
      }

      const { error } = await adminClient
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', targetUserId);
      if (error) throw error;

      return json({ success: true });
    }

    return json({ error: 'Unknown admin action.' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected server error.' }, 500);
  }
});
