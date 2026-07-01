const SUPABASE_URL = 'https://ehtrqdxbeqikjmjvmxii.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHJxZHhiZXFpa2ptanZteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTgyNzIsImV4cCI6MjA5NjkzNDI3Mn0.qYzsWqJnxyMLlUU9dN6q1enAKwlwo3MnwZRn_DLcPxk';

const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const form = document.querySelector('#loginForm');
const message = document.querySelector('#message');
const submitButton = document.querySelector('#submitButton');
const resetPasswordButton = document.querySelector('#resetPasswordButton');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = type ? `message ${type}` : 'message';
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Signing in...' : 'Sign in';
  emailInput.disabled = isLoading;
  passwordInput.disabled = isLoading;
}

function friendlyAuthError(error) {
  const text = String(error?.message || '').toLowerCase();

  if (text.includes('invalid login credentials')) {
    return 'Email or password is incorrect.';
  }

  if (text.includes('email not confirmed')) {
    return 'This account has not been confirmed yet.';
  }

  if (text.includes('email logins are disabled')) {
    return 'Email login is disabled in Supabase Auth settings.';
  }

  if (text.includes('failed to fetch') || text.includes('network')) {
    return 'Could not connect. Check the internet connection and try again.';
  }

  return error?.message || 'Could not sign in. Please try again.';
}

async function redirectIfAlreadyLoggedIn() {
  if (!supabaseClient) {
    setMessage('Supabase could not load. Check the script tag and internet connection.', 'error');
    submitButton.disabled = true;
    return;
  }

  setLoading(true);
  setMessage('Checking session...', 'success');

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    setLoading(false);
    setMessage(friendlyAuthError(error), 'error');
    return;
  }

  if (data.session) {
    window.location.replace('yard1.html');
    return;
  }

  setLoading(false);
  const reason = new URLSearchParams(window.location.search).get('reason');
  setMessage(
    reason === 'inactive'
      ? 'This staff account is inactive. Contact an administrator.'
      : '',
    reason === 'inactive' ? 'error' : ''
  );
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!supabaseClient) return;

  setMessage('');
  emailInput.setAttribute('aria-invalid', 'false');
  passwordInput.setAttribute('aria-invalid', 'false');
  setLoading(true);

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    emailInput.setAttribute('aria-invalid', 'true');
    passwordInput.setAttribute('aria-invalid', 'true');
    setLoading(false);
    setMessage(friendlyAuthError(error), 'error');
    return;
  }

  setMessage('Signed in. Opening yard manager...', 'success');
  window.location.replace('yard1.html');
});

resetPasswordButton.addEventListener('click', async () => {
  const email = emailInput.value.trim();

  if (!email) {
    emailInput.focus();
    emailInput.setAttribute('aria-invalid', 'true');
    setMessage('Enter your email address first.', 'error');
    return;
  }

  resetPasswordButton.disabled = true;
  resetPasswordButton.textContent = 'Sending reset link...';
  setMessage('');

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: new URL('set-password.html', window.location.href).href
  });

  if (error) {
    setMessage(friendlyAuthError(error), 'error');
    resetPasswordButton.disabled = false;
    resetPasswordButton.textContent = 'Forgot password?';
    return;
  }

  setMessage('Check your email for a password reset link.', 'success');
  resetPasswordButton.disabled = false;
  resetPasswordButton.textContent = 'Forgot password?';
});

redirectIfAlreadyLoggedIn();
