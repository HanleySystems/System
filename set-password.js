const SUPABASE_URL = 'https://ehtrqdxbeqikjmjvmxii.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHJxZHhiZXFpa2ptanZteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTgyNzIsImV4cCI6MjA5NjkzNDI3Mn0.qYzsWqJnxyMLlUU9dN6q1enAKwlwo3MnwZRn_DLcPxk';

const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const form = document.querySelector('#passwordForm');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmPassword');
const submitButton = document.querySelector('#submitButton');
const message = document.querySelector('#message');

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = type ? `message ${type}` : 'message';
}

async function checkLink() {
  if (!supabaseClient) {
    setMessage('Could not connect to Supabase.', 'error');
    submitButton.disabled = true;
    return;
  }

  const code = new URLSearchParams(window.location.search).get('code');
  let { data } = await supabaseClient.auth.getSession();

  if (!data.session && code) {
    const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
    if (error) {
      setMessage('This link is invalid or has expired. Ask an administrator to send another.', 'error');
      submitButton.disabled = true;
      return;
    }
    ({ data } = await supabaseClient.auth.getSession());
  }

  if (!data.session) {
    setMessage('This link is invalid or has expired. Ask an administrator to send another.', 'error');
    submitButton.disabled = true;
    return;
  }

  setMessage('Enter a password of at least 10 characters.');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (password.value !== confirmPassword.value) {
    setMessage('The passwords do not match.', 'error');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Saving...';

  const { error } = await supabaseClient.auth.updateUser({
    password: password.value
  });

  if (error) {
    setMessage(error.message, 'error');
    submitButton.disabled = false;
    submitButton.textContent = 'Set password';
    return;
  }

  setMessage('Password saved. Opening the yard manager...', 'success');
  window.location.replace('yard1.html');
});

checkLink();
