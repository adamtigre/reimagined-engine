import { http } from './http';
import { ui } from './ui';

/**
 * Submits form data to create or update a post
 */
function submitData() {
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;

  const data = {
    title,
    body
  };

  // Validate input
  if (title === '' || body === '') {
    ui.showAlert("All fields are required", "alert alert-danger");
  } else {
    // Check for ID
    if (id === '') {
      // Create Post
      http.post("http://localhost:3000/all-post", data)
        .then(data => {
          ui.showAlert("Post added", "alert alert-success");
          ui.clearFields();
          getPosts();
        })
        .catch(err => console.log(err));
    } else {
      // Update Post
      http.put(`http://localhost:3000/all-post/${id}`, data)
        .then(data => {
          ui.showAlert("Post updated", "alert alert-success");
          ui.changeFormState();
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
}

/**
 * Enables editing of a post
 * @param {Event} e - The event object
 */
function enableEdit(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('edit')) {
    const id = e.target.parentElement.dataset.id;
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
    const body = e.target.parentElement.previousElementSibling.textContent;

    const data = {
      id,
      title,
      body
    };

    // Fill form with current post
    ui.fillForm(data);
  }
}

/**
 * Fetches all posts from the server
 */
function getPosts() {
  http.get("http://localhost:3000/all-post")
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err));
}

/**
 * Deletes a post
 * @param {Event} e - The event object
 */
function deletePost(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('delete')) {
    const id = e.target.parentElement.dataset.id;
    if (confirm("Are you sure?")) {
      http.delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert("Post removed", "alert alert-success");
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
}

/**
 * Cancels the edit state of the form
 * @param {Event} e - The event object
 */
function cancelEdit(e) {
  e.preventDefault();
  if (e.target.classList.contains('post-cancel')) {
    ui.changeFormState("add");
  }
}

// Get posts on DOM load
addEventListener('DOMContentLoaded', getPosts);

// Listen for form submission
document.querySelector(".post-submit").addEventListener('click', submitData);

// Listen for delete post
document.querySelector("#posts").addEventListener('click', deletePost);

// Listen for enable edit state
document.querySelector('#posts').addEventListener('click', enableEdit);

// Listen for cancel edit
document.querySelector('.card-form').addEventListener('click', cancelEdit);
