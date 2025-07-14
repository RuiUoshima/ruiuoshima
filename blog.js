<!-- Firebase SDK 読み込み -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyB5mzne8udXUBHfTRs2FOGSXLFVLtuP6-A",
    authDomain: "myhomepage-79e04.firebaseapp.com",
    projectId: "myhomepage-79e04",
    storageBucket: "myhomepage-79e04.appspot.com",
    messagingSenderId: "534104786677",
    appId: "1:534104786677:web:4825f0357d37b5b160a7bc"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const postBtn = document.getElementById("post-blog");
  const titleInput = document.getElementById("blog-title");
  const contentInput = document.getElementById("blog-content");
  const blogList = document.getElementById("blog-list");

  let editingId = null;

  postBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) return;

    if (editingId) {
      const docRef = doc(db, "blogs", editingId);
      await updateDoc(docRef, {
        title,
        content,
        timestamp: serverTimestamp()
      });
      editingId = null;
      postBtn.textContent = "Post";
    } else {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        timestamp: serverTimestamp()
      });
    }

    titleInput.value = "";
    contentInput.value = "";
  });

  function renderBlog(id, data) {
    const div = document.createElement("div");
    div.className = "blog-entry";
    const time = data.timestamp?.toDate().toLocaleString() || "";

    div.innerHTML = `
      <h3>${data.title}</h3>
      <div class="entry-meta">${time}</div>
      <p>${data.content}</p>
      <button onclick="editBlog('${id}', '${data.title}', \`${data.content.replace(/`/g, "\\`")}\`)">Edit</button>
      <button onclick="deleteBlog('${id}')">Delete</button>
    `;
    blogList.appendChild(div);
  }

  window.editBlog = function(id, title, content) {
    titleInput.value = title;
    contentInput.value = content;
    editingId = id;
    postBtn.textContent = "Update";
  };

  window.deleteBlog = async function(id) {
    if (confirm("Delete this blog post?")) {
      await deleteDoc(doc(db, "blogs", id));
    }
  };

  // リアルタイム更新
  const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    blogList.innerHTML = "";
    snapshot.forEach(doc => {
      renderBlog(doc.id, doc.data());
    });
  });
</script>
