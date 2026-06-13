const SUPABASE_URL = 'https://ehtrqdxbeqikjmjvmxii.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHJxZHhiZXFpa2ptanZteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTgyNzIsImV4cCI6MjA5NjkzNDI3Mn0.qYzsWqJnxyMLlUU9dN6q1enAKwlwo3MnwZRn_DLcPxk';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const form = document.querySelector('#loginForm');
const message = document.querySelector('#message');
const submitButton = document.querySelector('#submitButton');

async function redirectIfAlreadyLoggedIn() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = 'yard1.html';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  submitButton.disabled = true;
  submitButton.textContent = 'Signing in...';

  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = error.message;
    submitButton.disabled = false;
    submitButton.textContent = 'Sign in';
    return;
  }

  window.location.href = 'yard1.html';
});

redirectIfAlreadyLoggedIn();
