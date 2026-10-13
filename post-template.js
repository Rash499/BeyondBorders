(() => {
  const body = document.body;
  const toggle = document.getElementById("togglePostView");
  const errorBox = document.getElementById("postError");
  const byId = (id) => document.getElementById(id);
  const setText = (id, value) => { byId(id).textContent = value || ""; };

  toggle.addEventListener("click", () => {
    const onlyPost = body.classList.toggle("post-only");
    toggle.textContent = onlyPost ? "Show editing notes" : "Show only the post";
    toggle.setAttribute("aria-pressed", String(onlyPost));
  });

  async function loadPost() {
    let contentUrl = body.dataset.contentUrl;
    if (!contentUrl) {
      const slug = new URLSearchParams(window.location.search).get("post");
      if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        throw new Error("Open this template with ?post=your-post-folder, or add data-content-url to a post page.");
      }
      contentUrl = `posts/${slug}/content.json`;
    }

    const response = await fetch(contentUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${contentUrl} (HTTP ${response.status}).`);
    const post = await response.json();

    document.title = `Beyond Borders | ${post.title || "Editorial post"}`;
    setText("postTitle", post.title);
    setText("postSummary", post.summary);
    setText("postKicker", post.kicker || "ගෝලීය විමසුම / WORLD BRIEF");
    setText("photoCaption", post.photoCaption);
    setText("postCategory", post.category || "භූ දේශපාලනය");
    setText("postImageName", post.photo || "news-photo.jpg");

    const photo = byId("postPhoto");
    const placeholder = byId("photoPlaceholder");
    const imageName = post.photo || "";
    if (imageName) {
      photo.style.backgroundImage = `url("${encodeURI(imageName).replace(/"/g, "%22")}")`;
      const img = new Image();
      img.onload = () => { placeholder.style.display = "none"; };
      img.onerror = () => { placeholder.style.display = "grid"; };
      img.src = imageName;
    } else {
      photo.style.backgroundImage = "none";
      placeholder.style.display = "grid";
    }
    setText("photoPlaceholderName", imageName || "Add a photo path in content.json");
  }

  loadPost().catch((error) => {
    errorBox.hidden = false;
    errorBox.textContent = "Post could not be loaded: " + error.message + " Make sure you open this page through GitHub Pages or another local web server (not directly as file://).";
  });
})();