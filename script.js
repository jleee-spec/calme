const menuButton = document.querySelector(".menu-button");
const menuDrawer = document.querySelector(".menu-drawer");
const menuClose = document.querySelector(".menu-close");
const cartButton = document.querySelector(".cart-button");
const closeButton = document.querySelector(".close-button");
const clearCartButton = document.querySelector(".clear-cart");
const overlay = document.querySelector(".overlay");
const cartDrawer = document.querySelector(".cart-drawer");
const perfumeLiquid = document.querySelector(".perfume-liquid");
const categoryButtons = document.querySelectorAll(".category");
const productCards = document.querySelectorAll(".product-card");
const addButtons = document.querySelectorAll(".add-button");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartCount = document.querySelector(".cart-count");
const totalPriceDisplay = document.getElementById("total-price"); // 修正用に取得

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let count = cart.length;

let totalPrice = cart.reduce((sum, item) => {
  return sum + item.price;
}, 0);

// カートの状態を更新する関数
function updateCartState() {
  cartCount.textContent = count;

  // 合計金額の更新
  if (totalPriceDisplay) {
    totalPriceDisplay.textContent = `¥${totalPrice.toLocaleString()}`;
  }

  // 香水の液体アニメーション
  const liquidHeight = Math.min(count * 7, 22);
  perfumeLiquid.style.height = `${liquidHeight}px`;

  const isEmpty = count === 0;
  perfumeLiquid.style.opacity = isEmpty ? "0" : "0.85";
  cartEmpty.style.display = isEmpty ? "block" : "none";
}

// カートを閉じる処理
function closeCart() {
  cartDrawer.classList.add("hidden");

  if (cartButton) {
    cartButton.classList.remove("move");
  }

  // メニューも閉じていたらoverlayを消す
  if (!menuDrawer.classList.contains("active")) {
    overlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }
}

function closeMenu() {
  menuDrawer.classList.remove("active");

  // カートも閉じていたらoverlayを消す
  if (cartDrawer.classList.contains("hidden")) {
    overlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }
}

// イベントリスナー設定
if (menuButton) {
  menuButton.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    menuDrawer.classList.add("active");
    document.body.classList.add("no-scroll");
  });
}

if (menuClose) {
  menuClose.addEventListener("click", closeMenu);
}

if (cartButton) {
  cartButton.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    cartDrawer.classList.remove("hidden");
    cartButton.classList.add("move");
    document.body.classList.add("no-scroll");
  });
}

if (closeButton) {
  closeButton.addEventListener("click", closeCart);
}

if (overlay) {
  overlay.addEventListener("click", () => {
    closeCart();
    closeMenu();
  });
}

if (cartDrawer) {
  cartDrawer.addEventListener("click", () => {
    if (menuDrawer && menuDrawer.classList.contains("active")) {
      closeMenu();
    }
  });
}

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    cartItems.innerHTML = "";

    cart = [];
    count = 0;
    totalPrice = 0;

    localStorage.removeItem("cart");

    updateCartState();
  });
}

// カテゴリー選択
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    productCards.forEach((card) => {
      card.style.display = (category === "all" || category === card.dataset.category) ? "block" : "none";
    });
  });
});

// 商品追加ボタン
addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const image = button.dataset.image;

    count++;
    totalPrice += price;

    cart.push({
      name: name,
      price: price,
      image: image
    });

localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
    
    cartButton.classList.add("bump");
    setTimeout(() => cartButton.classList.remove("bump"), 350);

    const item = document.createElement("div");
    item.classList.add("cart-item");
    item.innerHTML = `
      <img src="${image}" class="cart-item-image" alt="${name}">
      <div class="cart-item-info">
        <h4>${name}</h4>
        <p>¥${price.toLocaleString()}</p>
      </div>
      <button class="remove-button">🗑️</button>
    `;

    cartItems.appendChild(item);

    // 削除ボタンのイベント
    item.querySelector(".remove-button").addEventListener("click", () => {
      item.remove();
    
      cart = cart.filter(item => item.name !== name);
      localStorage.setItem("cart", JSON.stringify(cart));
    
      count--;
      totalPrice -= price;
    
      updateCartState();
    });

    updateCartState();
    
  });
});

document
.querySelectorAll(".menu-nav a")
.forEach(link => {
  link.addEventListener("click", (e) => {
    const category = link.dataset.menu;
    // HOMEにはdata-menuがないので普通に移動させる
    if (!category) {
      closeMenu();
      return;
    }
  
    e.preventDefault();
    if(category === "cart"){
      closeMenu();
    
      if (cartButton) {
        overlay.classList.remove("hidden");
        cartDrawer.classList.remove("hidden");
        cartButton.classList.add("move");
      }
    
      return;
    }

    const targetButton =
      document.querySelector(
        `.category[data-category="${category}"]`
      );
    if(targetButton){
      targetButton.click();
    }
    closeMenu();
  });
});

const topButton = document.getElementById("topButton");

if (topButton) {

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      topButton.classList.add("show");
    } else {
      topButton.classList.remove("show");
    }
  });

  topButton.addEventListener("click", () => {

    topButton.classList.add("spin");

    // 押した瞬間にスクロール開始✨
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // アニメーション終了後にspinを外す
    setTimeout(() => {
      topButton.classList.remove("spin");
    }, 450);

  });

}

document.querySelectorAll(".product-card").forEach(card => {

  card.addEventListener("click", (e) => {

    if (e.target.classList.contains("add-button")) return;

    const category = card.dataset.category;

    switch (category) {

      case "skincare":
        location.href = "skincare.html";
        break;

      case "makeup":
        location.href = "makeup.html";
        break;

      case "haircare":
        location.href = "haircare.html";
        break;

      case "fragrance":
        location.href = "fragrance.html";
        break;

    }

  });

});

const detailTopButton = document.querySelector(".detail-top-button");

if (detailTopButton) {

  detailTopButton.addEventListener("click", () => {

    detailTopButton.classList.add("spin");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setTimeout(() => {
      detailTopButton.classList.remove("spin");
    }, 450);

  });

}

// お会計ページ
const checkoutItems = document.querySelector(".checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const reviewTotal = document.getElementById("review-total");
const reviewItems = document.querySelector(".review-items");

if (checkoutItems && checkoutTotal) {

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  console.log(cart);

  let total = 0;

  cart.forEach(item => {

    total += item.price;
  
    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <img src="${item.image}" class="checkout-item-image">
        <div class="checkout-item-info">
          <h4>${item.name}</h4>
          <p>¥${item.price.toLocaleString()}</p>
        </div>
      </div>
    `;
  
    if (reviewItems) {
      reviewItems.innerHTML += `
        <div class="checkout-item">
          <img src="${item.image}" class="checkout-item-image">
          <div class="checkout-item-info">
            <h4>${item.name}</h4>
            <p>¥${item.price.toLocaleString()}</p>
          </div>
        </div>
      `;
    }
  
  });

  checkoutTotal.textContent = `¥${total.toLocaleString()}`;

  if (reviewTotal) {
    reviewTotal.textContent = `¥${total.toLocaleString()}`;
  }
}

if (cartItems) {

  cart.forEach((item, index) => {

    const div = document.createElement("div");

    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.image}" class="cart-item-image">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>¥${item.price.toLocaleString()}</p>
      </div>
      <button class="remove-button">🗑️</button>
    `;

    cartItems.appendChild(div);


    div.querySelector(".remove-button").addEventListener("click", () => {

      cart.splice(index, 1);

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      div.remove();

      count = cart.length;

      totalPrice = cart.reduce((sum, item) => {
        return sum + item.price;
      }, 0);

      updateCartState();

    });

  });

  updateCartState();
}

const step1 = document.querySelector(".step1");
const step2 = document.querySelector(".step2");
const step3 = document.querySelector(".step3");
const step4 = document.querySelector(".step4");

if (step1 && step2 && step3 && step4) {

  const circles = document.querySelectorAll(".step-circle");

  document.querySelector(".next-step1").addEventListener("click", () => {

    const inputs = step1.querySelectorAll("input");
  
    for (const input of inputs) {
      if (input.value.trim() === "") {
        alert("Please fill in all fields.");
        input.focus();
        return;
      }
    }
  
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  
    circles[0].classList.remove("active");
    circles[1].classList.add("active");
  
      document.querySelector(".step-indicator")
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }); 

  document.querySelector(".next-step2").addEventListener("click", () => {

    const inputs = step2.querySelectorAll("input");
  
    for (const input of inputs) {
      if (input.value.trim() === "") {
        alert("Please fill in all payment fields.");
        input.focus();
        return;
      }
    }
  
    step2.classList.add("hidden");
    step3.classList.remove("hidden");
  
    circles[1].classList.remove("active");
    circles[2].classList.add("active");
  
    document.querySelector(".order-summary")
      .classList.add("hidden");
  
    document.querySelector(".step-indicator")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  });

  document.querySelector(".next-step3").addEventListener("click", () => {
    step3.classList.add("hidden");
    step4.classList.remove("hidden");

    circles[2].classList.remove("active");
    circles[3].classList.add("active");

    cart = [];
    localStorage.removeItem("cart");

    document.querySelector(".step-indicator")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}