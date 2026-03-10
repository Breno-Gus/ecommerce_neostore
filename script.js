const cartIcon = document.querySelector(".cart");
const cartCount = document.querySelector(".cartCount");

let cart = loadCart();

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function save() {
  saveCart();
  updateCount();
  renderButtons();
  renderCart();
}

function money(v) {
  return v.toFixed(2).replace(".", ",");
}

/* TOAST */

const toast = document.createElement("div");
toast.className = `
fixed left-1/2 bottom-6 -translate-x-1/2 translate-y-6
opacity-0 pointer-events-none
bg-[#161b22] border border-[#2a2f36] text-white
px-5 py-3 rounded-xl shadow-2xl
transition-all duration-300 z-[60]
`;
toast.textContent = "Adicionado o produto ao carrinho!";
document.body.appendChild(toast);

let toastTimer;

function showToast(message = "Adicionado o produto ao carrinho!") {
  toast.textContent = message;
  toast.classList.remove("opacity-0", "translate-y-6");
  toast.classList.add("opacity-100", "translate-y-0");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-6");
  }, 1800);
}

function updateCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cartIcon) {
    cartIcon.dataset.count = total;
  }

  if (cartCount) {
    cartCount.textContent = total;
    cartCount.style.display = total > 0 ? "flex" : "none";
  }
}

function findItem(name) {
  return cart.find((item) => item.name === name);
}

function addItem(name, price) {
  const item = findItem(name);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  save();
  showToast();
}

function removeItem(name) {
  const item = findItem(name);

  if (!item) return;

  item.qty -= 1;

  if (item.qty <= 0) {
    cart = cart.filter((p) => p.name !== name);
  }

  save();
}

/* BOTÕES DOS PRODUTOS */

function renderButtons() {
  document.querySelectorAll(".card").forEach((card) => {
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const area = card.querySelector(".addCart");

    if (!area || !name || Number.isNaN(price)) return;

    const item = findItem(name);

    if (item) {
      area.innerHTML = `
        <div class="qtyControl">
          <button type="button" class="qtyBtn minus" aria-label="Remover um item">−</button>
          <span class="qtyValue">${item.qty}</span>
          <button type="button" class="qtyBtn plus" aria-label="Adicionar um item">+</button>
        </div>
      `;

      area.querySelector(".plus").onclick = () => addItem(name, price);
      area.querySelector(".minus").onclick = () => removeItem(name);
    } else {
      area.innerHTML = `
        <button type="button" class="addButton text-white">
          Adicionar ao carrinho
        </button>
      `;

      area.querySelector("button").onclick = () => addItem(name, price);
    }
  });
}

/* PAINEL DO CARRINHO */

const panel = document.createElement("div");

panel.className = `
fixed right-[-380px] top-0
w-[360px] max-w-[92vw] h-full
bg-[#161b22]
p-6
transition-all duration-500
shadow-2xl
border-l border-[#222]
z-50
flex flex-col
`;

panel.innerHTML = `
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-xl font-bold">Seu carrinho</h2>
    <button type="button" class="closeCart w-10 h-10 rounded-xl bg-[#0d1117] border border-[#2a2f36] hover:border-primary transition">
      ✕
    </button>
  </div>

  <div class="cartItems flex flex-col gap-3 overflow-y-auto flex-1 pr-1"></div>

  <div class="cartTotal flex justify-between border-t border-[#222] pt-4 mt-4 font-semibold text-lg">
    <span>Total</span>
    <span class="totalValue">R$0,00</span>
  </div>

  <button type="button" class="mt-4 bg-indigo-500 hover:bg-indigo-600 transition py-3 rounded-xl font-semibold">
    Finalizar pedido
  </button>
`;

document.body.appendChild(panel);

function renderCart() {
  const items = panel.querySelector(".cartItems");
  const total = panel.querySelector(".totalValue");

  items.innerHTML = "";

  let sum = 0;

  if (cart.length === 0) {
    items.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center border border-dashed border-[#2a2f36] rounded-2xl py-10 px-6 text-gray-400">
        <span class="text-3xl mb-3">🛒</span>
        <p class="font-semibold text-gray-300">Seu carrinho está vazio</p>
        <p class="text-sm mt-1">Adicione produtos para vê-los aqui.</p>
      </div>
    `;
    total.innerText = "R$0,00";
    return;
  }

  cart.forEach((p, i) => {
    sum += p.price * p.qty;

    items.innerHTML += `
      <div class="flex items-center justify-between gap-3 bg-[#0d1117] border border-[#222] rounded-2xl p-3">
        <div class="min-w-0">
          <span class="text-sm font-semibold block truncate">${p.name}</span>
          <div class="text-xs opacity-60 mt-1">
            ${p.qty} x R$${money(p.price)}
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button type="button" data-i="${i}" class="decCart w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 transition font-bold">
            −
          </button>

          <span class="w-6 text-center text-sm font-semibold">${p.qty}</span>

          <button type="button" data-i="${i}" class="incCart w-8 h-8 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-bold">
            +
          </button>
        </div>
      </div>
    `;
  });

  total.innerText = "R$" + money(sum);
}

function openCart() {
  panel.classList.remove("right-[-380px]");
  panel.classList.add("right-0");
}

function closeCart() {
  panel.classList.remove("right-0");
  panel.classList.add("right-[-380px]");
}

/* EVENTOS GERAIS */

document.addEventListener("click", (e) => {
  if (e.target.closest(".cart")) {
    openCart();
  }

  if (e.target.classList.contains("closeCart")) {
    closeCart();
  }

  if (e.target.classList.contains("incCart")) {
    const i = Number(e.target.dataset.i);
    if (!Number.isNaN(i) && cart[i]) {
      cart[i].qty += 1;
      save();
      showToast();
    }
  }

  if (e.target.classList.contains("decCart")) {
    const i = Number(e.target.dataset.i);

    if (!Number.isNaN(i) && cart[i]) {
      cart[i].qty -= 1;

      if (cart[i].qty <= 0) {
        cart.splice(i, 1);
      }

      save();
    }
  }
});

/* CARROSSEL */

const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (track && slides.length > 0) {
  let index = 0;
  let autoSlide;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlide = setInterval(nextSlide, 6000);
  }

  function stopAutoSlide() {
    if (autoSlide) clearInterval(autoSlide);
  }

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    startAutoSlide();
  });

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    startAutoSlide();
  });

  track.addEventListener("mouseenter", stopAutoSlide);
  track.addEventListener("mouseleave", startAutoSlide);

  updateCarousel();
  startAutoSlide();
}

updateCount();
renderButtons();
renderCart();