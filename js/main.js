const SUPABASE_URL = 'https://enwbflhtxqzufvmurvcl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVud2JmbGh0eHF6dWZ2bXVydmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY0MTcsImV4cCI6MjA4OTk2MjQxN30.YbjdzGtavPSBR1eoahvVgVw0NMUlbTYfDIdrrQoXilc';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const postList = document.getElementById('post-list');
const postBody = document.getElementById('post-body');
const postAuthor = document.getElementById('post-author');
const postSubmit = document.getElementById('post-submit');

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function renderPost(post) {
  const div = document.createElement('div');
  div.className = 'post';
  div.innerHTML = `
    <p class="post-body">${post.body}</p>
    <span class="post-meta">${post.author} &middot; ${formatDate(post.created_at)}</span>
  `;
  postList.prepend(div);
}

async function loadPosts() {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  data.forEach(renderPost);
}

async function submitPost() {
  const body = postBody.value.trim();
  const author = postAuthor.value.trim();

  if (!body || !author) return;

  postSubmit.disabled = true;

  const { data, error } = await client
    .from('posts')
    .insert([{ body, author }])
    .select()
    .single();

  if (error) {
    console.error(error);
    postSubmit.disabled = false;
    return;
  }

  postBody.value = '';
  renderPost(data);
  postSubmit.disabled = false;
}

postSubmit.addEventListener('click', submitPost);

loadPosts();
