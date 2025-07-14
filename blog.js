<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Rui's Blog</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
</head>
<body>

<header class="navbar">
  <div class="navbar-left"><a href="index.html">← Back</a></div>
  <div class="navbar-right">Rui's Blog</div>
</header>

<section class="blog">
  <h2>Write a Blog Post</h2>
  <input type="text" id="blog-title" placeholder="Title"><br>
  <textarea id="blog-content" placeholder="What's on your mind?"></textarea><br>
  <input type="file" id="blog-image"><br>
  <button id="post-blog">Post</button>
</section>

<hr>

<section id="blog-list"></section>

<script src="blog.js"></script>

<script>
  const postBtn = document.getElementById("post-blog");
  const titleInput = document.getElementById("blog-title");
  const contentInput = document.getElementById("blog-content");
  const imageInput = document.getElementById("blog-image");
  const blogList = document.getElementById("blog-list");

  let blogData = JSON.parse(localStorage.getItem("blogPosts")) || [];

  function renderBlogs() {
    blogList.innerHTML = "";
    blogData.forEach((entry, index) => {
      const div = document.createElement("div");
      div.className = "blog-entry";
      div.innerHTML = `
        <h3>${entry.title}</h3>
        <p>${entry.content}</p>
        ${entry.image ? `<img src="${entry.image}" alt="Blog Image">` : ""}
        <button onclick="editBlog(${index})">Edit</button>
        <button onclick="deleteBlog(${index})">Delete</button>
      `;
      blogList.appendChild(div);
    });
  }

  postBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const file = imageInput.files[0];

    if (!title || !content) return;

    // 画像を読み込み（非同期処理）
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        saveBlog(title, content, e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      saveBlog(title, content, null);
    }
  });

  function saveBlog(title, content, image) {
    if (postBtn.dataset.editing !== undefined) {
      const index = parseInt(postBtn.dataset.editing);
      blogData[index] = { title, content, image };
      delete postBtn.dataset.editing;
      postBtn.textContent = "Post";
    } else {
      blogData.unshift({ title, content, image });
    }

    localStorage.setItem("blogPosts", JSON.stringify(blogData));
    titleInput.value = "";
    contentInput.value = "";
    imageInput.value = "";
    renderBlogs();
  }

  window.editBlog = function(index) {
    const entry = blogData[index];
    titleInput.value = entry.title;
    contentInput.value = entry.content;
    postBtn.dataset.editing = index;
    postBtn.textContent = "Update";
  };

  window.deleteBlog = function(index) {
    if (confirm("Delete this blog post?")) {
      blogData.splice(index, 1);
      localStorage.setItem("blogPosts", JSON.stringify(blogData));
      renderBlogs();
    }
  };

  renderBlogs();
</script>
</body>
</html>
