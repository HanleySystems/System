const SUPABASE_URL = 'https://ehtrqdxbeqikjmjvmxii.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHJxZHhiZXFpa2ptanZteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTgyNzIsImV4cCI6MjA5NjkzNDI3Mn0.qYzsWqJnxyMLlUU9dN6q1enAKwlwo3MnwZRn_DLcPxk';

const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const adminEmail = document.querySelector('#adminEmail');
const inviteForm = document.querySelector('#inviteForm');
const inviteButton = document.querySelector('#inviteButton');
const inviteName = document.querySelector('#inviteName');
const inviteEmail = document.querySelector('#inviteEmail');
const logoutButton = document.querySelector('#logoutButton');
const refreshButton = document.querySelector('#refreshButton');
const staffTable = document.querySelector('#staffTable');
const pageMessage = document.querySelector('#pageMessage');

let currentUserId = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setMessage(text, isError = false) {
  pageMessage.textContent = text;
  pageMessage.className = isError ? 'message error' : 'message';
}

function formatDate(value) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en-IE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

async function callAdminFunction(action, payload = {}) {
  const { data, error } = await supabaseClient.functions.invoke('staff-admin', {
    body: { action, ...payload }
  });

  if (error) {
    let message = error.message;
    try {
      const response = await error.context?.json();
      message = response?.error || message;
    } catch {
      // Keep the standard client error.
    }
    throw new Error(message);
  }

  if (data?.error) throw new Error(data.error);
  return data;
}

function renderStaff(users) {
  if (!users.length) {
    staffTable.innerHTML = '<tr><td colspan="5" class="loading-cell">No staff accounts found.</td></tr>';
    return;
  }

  staffTable.innerHTML = users.map((user) => {
    const isCurrentUser = user.id === currentUserId;
    const active = user.is_active !== false;
    const actionLabel = active ? 'Deactivate' : 'Reactivate';
    const action = active ? 'deactivate' : 'reactivate';
    const roleOptions = ['staff', 'admin'].map((role) => (
      `<option value="${role}" ${user.role === role ? 'selected' : ''}>${role === 'admin' ? 'Admin' : 'Staff'}</option>`
    )).join('');

    return `
      <tr>
        <td>
          <span class="staff-name">${escapeHtml(user.full_name || 'Unnamed staff member')}</span>
          <span class="staff-email">${escapeHtml(user.email || '')}</span>
        </td>
        <td>
          <select class="role-select" data-user-id="${user.id}" aria-label="Role for ${escapeHtml(user.email)}" ${isCurrentUser ? 'disabled' : ''}>
            ${roleOptions}
          </select>
        </td>
        <td><span class="status ${active ? 'active' : ''}">${active ? 'Active' : 'Inactive'}</span></td>
        <td>${escapeHtml(formatDate(user.last_sign_in_at))}</td>
        <td>
          <div class="row-actions">
            <button class="row-action reset-action" type="button" data-email="${escapeHtml(user.email)}">Reset password</button>
            <button class="row-action ${active ? 'danger' : ''} status-action" type="button" data-action="${action}" data-user-id="${user.id}" ${isCurrentUser ? 'disabled' : ''}>${actionLabel}</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function loadStaff() {
  refreshButton.disabled = true;
  staffTable.innerHTML = '<tr><td colspan="5" class="loading-cell">Loading staff...</td></tr>';

  try {
    const data = await callAdminFunction('list');
    renderStaff(data.users || []);
  } catch (error) {
    staffTable.innerHTML = `<tr><td colspan="5" class="loading-cell">${escapeHtml(error.message)}</td></tr>`;
  } finally {
    refreshButton.disabled = false;
  }
}

async function requireAdmin() {
  if (!supabaseClient) {
    window.location.replace('login.html');
    return false;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data.session) {
    window.location.replace('login.html');
    return false;
  }

  currentUserId = data.session.user.id;
  adminEmail.textContent = data.session.user.email || 'Signed in';

  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('role, is_active')
    .eq('id', currentUserId)
    .single();

  if (profileError || profile?.role !== 'admin' || !profile?.is_active) {
    window.location.replace('yard1.html');
    return false;
  }

  return true;
}

inviteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  inviteButton.disabled = true;
  inviteButton.textContent = 'Sending...';
  setMessage('');

  try {
    await callAdminFunction('invite', {
      name: inviteName.value.trim(),
      email: inviteEmail.value.trim(),
      redirectTo: new URL('set-password.html', window.location.href).href
    });
    inviteForm.reset();
    setMessage('Invitation sent successfully.');
    await loadStaff();
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    inviteButton.disabled = false;
    inviteButton.textContent = 'Send invitation';
  }
});

staffTable.addEventListener('click', async (event) => {
  const statusButton = event.target.closest('.status-action');
  const resetButton = event.target.closest('.reset-action');
  if (!statusButton && !resetButton) return;

  const button = statusButton || resetButton;
  button.disabled = true;
  setMessage('');

  try {
    if (statusButton) {
      await callAdminFunction(statusButton.dataset.action, {
        userId: statusButton.dataset.userId
      });
      setMessage(`Staff account ${statusButton.dataset.action === 'deactivate' ? 'deactivated' : 'reactivated'}.`);
      await loadStaff();
    } else {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(
        resetButton.dataset.email,
        { redirectTo: new URL('set-password.html', window.location.href).href }
      );
      if (error) throw error;
      setMessage('Password reset email sent.');
    }
  } catch (error) {
    setMessage(error.message, true);
    button.disabled = false;
  }
});

staffTable.addEventListener('change', async (event) => {
  const select = event.target.closest('.role-select');
  if (!select) return;

  select.disabled = true;
  setMessage('');
  try {
    await callAdminFunction('set-role', {
      userId: select.dataset.userId,
      role: select.value
    });
    setMessage('Staff role updated.');
  } catch (error) {
    setMessage(error.message, true);
    await loadStaff();
  } finally {
    select.disabled = false;
  }
});

refreshButton.addEventListener('click', loadStaff);

logoutButton.addEventListener('click', async () => {
  logoutButton.disabled = true;
  await supabaseClient.auth.signOut();
  window.location.replace('login.html');
});

async function init() {
  const allowed = await requireAdmin();
  if (allowed) await loadStaff();
}

init();
