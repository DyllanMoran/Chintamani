var SUPABASE_URL = 'https://enwbflhtxqzufvmurvcl.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVud2JmbGh0eHF6dWZ2bXVydmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY0MTcsImV4cCI6MjA4OTk2MjQxN30.YbjdzGtavPSBR1eoahvVgVw0NMUlbTYfDIdrrQoXilc';

var client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var affirmationList = document.getElementById('affirmation-list');
var affirmationBody = document.getElementById('affirmation-body');
var affirmationSubmit = document.getElementById('affirmation-submit');

function formatDate(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    + ' at '
    + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function renderAffirmation(entry) {
  var div = document.createElement('div');
  div.className = 'post-item';
  div.dataset.id = entry.id;
  div.innerHTML =
    '<span class="post-body">I am ' + entry.body + '</span> ' +
    '<span class="post-meta">(' + formatDate(entry.created_at) +
      ' · <button class="post-actions button" onclick="editAffirmation(' + entry.id + ')">edit</button>' +
      ' · <button class="post-actions button" onclick="deleteAffirmation(' + entry.id + ')">delete</button>)</span>';
  affirmationList.appendChild(div);
}

async function loadAffirmations() {
  var { data, error } = await client
    .from('This is Real')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  data.forEach(renderAffirmation);
}

async function submitAffirmation() {
  var body = affirmationBody.value.trim();
  if (!body) return;

  affirmationSubmit.disabled = true;

  var { data, error } = await client
    .from('This is Real')
    .insert([{ body: body }])
    .select()
    .single();

  if (error) {
    console.error(error);
    affirmationSubmit.disabled = false;
    return;
  }

  affirmationBody.value = '';
  var newEntry = document.createElement('div');
  newEntry.className = 'post-item';
  newEntry.dataset.id = data.id;
  newEntry.innerHTML =
    '<span class="post-body">I am ' + data.body + '</span> ' +
    '<span class="post-meta">(' + formatDate(data.created_at) +
      ' · <button class="post-actions button" onclick="editAffirmation(' + data.id + ')">edit</button>' +
      ' · <button class="post-actions button" onclick="deleteAffirmation(' + data.id + ')">delete</button>)</span>';
  affirmationList.prepend(newEntry);
  affirmationSubmit.disabled = false;
}

async function deleteAffirmation(id) {
  var div = document.querySelector('.post-item[data-id="' + id + '"]');
  if (!div) return;

  var { error } = await client
    .from('This is Real')
    .delete()
    .eq('id', id);

  if (error) { console.error(error); return; }
  div.remove();
}

async function editAffirmation(id) {
  var div = document.querySelector('.post-item[data-id="' + id + '"]');
  if (!div) return;

  var bodyEl = div.querySelector('.post-body');
  var currentText = bodyEl.textContent.replace(/^I am /, '');
  var originalHTML = div.innerHTML;

  bodyEl.innerHTML = 'I am <span class="edit-inline" contenteditable="true">' + currentText + '</span>';
  var editable = bodyEl.querySelector('.edit-inline');
  editable.focus();

  var meta = div.querySelector('.post-meta');
  meta.innerHTML = '(<button class="post-actions" data-action="save">save</button>' +
    ' · <button class="post-actions" data-action="cancel">cancel</button>)';

  meta.querySelector('[data-action="cancel"]').addEventListener('click', function () {
    div.innerHTML = originalHTML;
  });

  meta.querySelector('[data-action="save"]').addEventListener('click', async function () {
    var newBody = editable.textContent.trim();
    if (!newBody) return;

    var { error } = await client
      .from('This is Real')
      .update({ body: newBody })
      .eq('id', id);

    if (error) { console.error(error); return; }

    div.innerHTML = originalHTML;
    div.querySelector('.post-body').textContent = 'I am ' + newBody;
  });
}

affirmationSubmit.addEventListener('click', submitAffirmation);

loadAffirmations();
