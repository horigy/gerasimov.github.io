const burger = document.querySelector('.hamburger-menu-link');
const fixedMenu = document.querySelector('#hamburger-menu');
const close = document.querySelector ('.hamburger-menu_close')

burger.addEventListener('click', function (e) {
    e.preventDefault();
    fixedMenu.classList.add('visible');
})

close.addEventListener('click', function (e) {
    e.preventDefault();
    fixedMenu.classList.remove('visible');
})


const left = document.querySelector("#left");
const right = document.querySelector("#right");
const items = document.querySelector("#items");

right.addEventListener("click", function(e) {
  loop("right", e);
});
 
left.addEventListener("click", function(e) {
  loop("left", e);
});

function loop(direction, e) {
  e.preventDefault();
  if (direction === "right") {
    items.appendChild(items.firstElementChild);
  } else {
    items.insertBefore(items.lastElementChild, items.firstElementChild);
  }
}

var teamItem = document.getElementsByClassName("team_name");
var a;

for (let a = 0; a < teamItem.length; a++) {
  teamItem[a].addEventListener('click', function (e) {
    e.preventDefault();
    for (let b = 0; b < teamItem.length; b++) {
      const element = teamItem[b];
      if (element !== teamItem[a]) {
        element.classList.remove('team_name_active');
      }
    }
    this.classList.toggle('team_name_active');
  });
  
}

var accmenu = document.getElementsByClassName("accmenu_item");
var i;

for (let i=0; i < accmenu.length; i++) {
    accmenu[i].addEventListener("click", function (e) {
        e.preventDefault();
        for (let j = 0; j < accmenu.length; j++) {
          const element = accmenu[j];
          if (element !== accmenu[i]) {
            element.classList.remove('accmenu_item_active');
          }
        }
        this.classList.toggle("accmenu_item_active");
    });
}

const burgerContents = document.querySelector(".burger_contents")

burgerContents.addEventListener('click', function(e) {
  e.preventDefault();
  var contentList = document.querySelector(".burger_contents-list");
  if (contentList.style.display === "none") {
    contentList.style.display = "flex";
  } else {
    contentList.style.display = "none"
  }
})

const orderform = document.querySelector("#form");
const sendbutton = document.querySelector("#send");
const orderOverlay = document.querySelector(".order_overlay");
const closeOrderOverlay = document.querySelector("#order_close");

sendbutton.addEventListener('click', function(e) {
    e.preventDefault();

    var formData = new FormData(orderform);
     
    if (validateForm(orderform)) {
      const data = {
        name: orderform.elements.name.value,
        phone: orderform.elements.phone.value,
        comment: orderform.elements.comment.value,
        to: 'fox-race@mail.ru',
      };

      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          const element = data[k];
          formData.append(k, element)
          
        }
      }

      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json'
      xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
      xhr.send(formData)
      xhr.addEventListener('load', (e) => {
        
        if (e.target.response.status == 1) {
          orderOverlay.querySelector('.order_overlay-message-text').innerText = 'Сообщение отправлено';
          orderOverlay.style.display = 'flex';
        } else {
          orderOverlay.querySelector('.order_overlay-message-text').innerText = 'Сообщение не отправлено';
          console.log(e.target.response.status);
          orderOverlay.style.display = 'flex';
        }
        
      }
      );
    };
})

closeOrderOverlay.addEventListener('click', function(e) {
  e.preventDefault();
  orderOverlay.style.display = 'none';
})

function validateForm(form) {
  let valid = true;

  if (!validateField(form.elements.name)) {
    valid = false;
  }
  if (!validateField(form.elements.phone)) {
    valid = false;
  }
  if (!validateField(form.elements.comment)) {
    valid = false;
  }
  console.log(valid);
  return valid
}

function validateField(field) {
  if (!field.checkValidity()) {
    return false
  } else {
    return true
  }
}

const reviewOverlay = document.querySelector('.review_overlay');
const closeReviewOverlay = document.querySelector('.review_message-close');
var reviewBtns = document.querySelectorAll('.review_btn');

for (let index = 0; index < reviewBtns.length; index++) {
  const element = reviewBtns[index];
  element.addEventListener('click', function (e) {
    e.preventDefault();
    const user = e.target.parentNode.querySelector('.review_username').innerText;
    const text = e.target.parentNode.querySelector('.review_text').innerText;

    reviewOverlay.querySelector('.review_user-overlay').innerText = user;
    reviewOverlay.querySelector('.review_text-overlay').innerText = text;
    reviewOverlay.style.display = 'flex';
  })
}

closeReviewOverlay.addEventListener('click', function (e) {
  e.preventDefault();
  reviewOverlay.style.display = 'none';
})