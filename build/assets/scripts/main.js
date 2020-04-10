let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: '405',
        width: '660',
        videoId: 'M7lc1UVf-VE',
        events: {
        // 'onReady': onPlayerReady,
        // 'onStateChange': onPlayerStateChange
        },
        playerVars: {
            showInfo: 0,
            rel: 0,
            autoplay: 0,
            modestBranding: 0
        }
    });
}

const sections = $(".section");
const display = $(".main_content");

let inScroll = false;

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

const performTransition = sectionEq => {
  if (inScroll === false) {
    inScroll = true;

    const position = sectionEq * -100;

    sections.eq(sectionEq).addClass("active_section").siblings().removeClass("active_section");
  
    display.css({
      transform: `translateY(${position}%)`,
      // что это за кавычки?
    });

    // display.addEventListener("transitionend", function () {
    //   inScroll = false;
    // });

    setTimeout(() => {
      $(".fixed-menu__item").eq(sectionEq).addClass("active").siblings().removeClass("active");

      inScroll = false;
    }, 1300);
  }
  
}

const scrollSection = direction => {
  const activeSection = sections.filter(".active_section");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  if (nextSection.length && direction === 'next') {
    performTransition(nextSection.index());
  };

  if (prevSection.length && direction === 'prev') {
    performTransition(prevSection.index());
  }
}


$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;

  if (deltaY > 0) {
    scrollSection("next");
  };

  if (deltaY < 0) {
    scrollSection("prev");
  };
});

$(document).on("keydown", e => {
  const tagName = e.target.tagName.toLowerCase();

  if (tagName !== "input" && tagName !== "textarea" ) {
    switch(e.keyCode) {
      case 38: 
        scrollSection("prev");
        break;
      case 40: 
        scrollSection("next");
        break;
    }
  } 
});

$("[data-scroll-to]").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");
  performTransition(target);
})

if (isMobile) {
  $("body").swipe({
    swipe: (event, direction) => {
      let scrollDirection;
  
      if (direction === "up") scrollDirection = "next";
      if (direction === "down") scrollDirection = "prev";
      scrollSection(scrollDirection);
    }
  });
}


















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


ymaps.ready(init);
    
function init(){
        var myMap = new ymaps.Map("map", {
            center: [59.94727933529815,30.31857960489242],
            zoom: 11
        });

        var myPlacemark1 = new ymaps.Placemark([59.989729205041854,30.266903090982712], {}, {
          iconLayout: 'default#image',
          iconImageHref: '/img/icons/map-marker.svg',
          iconImageSize: [46, 57],
          iconImageOffset: [-23, -57]
        });

        myMap.geoObjects.add(myPlacemark1);

        var myPlacemark2 = new ymaps.Placemark([59.91565241058324,30.494278694826146], {}, {
          iconLayout: 'default#image',
          iconImageHref: '/img/icons/map-marker.svg',
          iconImageSize: [46, 57],
          iconImageOffset: [-23, -57]
        });

        myMap.geoObjects.add(myPlacemark2);

        var myPlacemark3 = new ymaps.Placemark([59.94524562108685,30.38264612248942], {}, {
          iconLayout: 'default#image',
          iconImageHref: '/img/icons/map-marker.svg',
          iconImageSize: [46, 57],
          iconImageOffset: [-23, -57]
        });

        myMap.geoObjects.add(myPlacemark3);

        var myPlacemark4 = new ymaps.Placemark([59.88895709324912,30.316041508231613], {}, {
          iconLayout: 'default#image',
          iconImageHref: '/img/icons/map-marker.svg',
          iconImageSize: [46, 57],
          iconImageOffset: [-23, -57]
        });

        myMap.geoObjects.add(myPlacemark4);
 }






//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsYXllci5qcyIsInNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHBsYXllcjtcclxuXHJcbmZ1bmN0aW9uIG9uWW91VHViZUlmcmFtZUFQSVJlYWR5KCkge1xyXG4gICAgcGxheWVyID0gbmV3IFlULlBsYXllcihcInBsYXllclwiLCB7XHJcbiAgICAgICAgaGVpZ2h0OiAnNDA1JyxcclxuICAgICAgICB3aWR0aDogJzY2MCcsXHJcbiAgICAgICAgdmlkZW9JZDogJ003bGMxVVZmLVZFJyxcclxuICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAvLyAnb25SZWFkeSc6IG9uUGxheWVyUmVhZHksXHJcbiAgICAgICAgLy8gJ29uU3RhdGVDaGFuZ2UnOiBvblBsYXllclN0YXRlQ2hhbmdlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwbGF5ZXJWYXJzOiB7XHJcbiAgICAgICAgICAgIHNob3dJbmZvOiAwLFxyXG4gICAgICAgICAgICByZWw6IDAsXHJcbiAgICAgICAgICAgIGF1dG9wbGF5OiAwLFxyXG4gICAgICAgICAgICBtb2Rlc3RCcmFuZGluZzogMFxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59IiwiXHJcbmNvbnN0IHNlY3Rpb25zID0gJChcIi5zZWN0aW9uXCIpO1xyXG5jb25zdCBkaXNwbGF5ID0gJChcIi5tYWluX2NvbnRlbnRcIik7XHJcblxyXG5sZXQgaW5TY3JvbGwgPSBmYWxzZTtcclxuXHJcbmNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbmNvbnN0IGlzTW9iaWxlID0gbWQubW9iaWxlKCk7XHJcblxyXG5jb25zdCBwZXJmb3JtVHJhbnNpdGlvbiA9IHNlY3Rpb25FcSA9PiB7XHJcbiAgaWYgKGluU2Nyb2xsID09PSBmYWxzZSkge1xyXG4gICAgaW5TY3JvbGwgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IHBvc2l0aW9uID0gc2VjdGlvbkVxICogLTEwMDtcclxuXHJcbiAgICBzZWN0aW9ucy5lcShzZWN0aW9uRXEpLmFkZENsYXNzKFwiYWN0aXZlX3NlY3Rpb25cIikuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcImFjdGl2ZV9zZWN0aW9uXCIpO1xyXG4gIFxyXG4gICAgZGlzcGxheS5jc3Moe1xyXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKCR7cG9zaXRpb259JSlgLFxyXG4gICAgICAvLyDRh9GC0L4g0Y3RgtC+INC30LAg0LrQsNCy0YvRh9C60Lg/XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBkaXNwbGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIC8vICAgaW5TY3JvbGwgPSBmYWxzZTtcclxuICAgIC8vIH0pO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKFwiLmZpeGVkLW1lbnVfX2l0ZW1cIikuZXEoc2VjdGlvbkVxKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgaW5TY3JvbGwgPSBmYWxzZTtcclxuICAgIH0sIDEzMDApO1xyXG4gIH1cclxuICBcclxufVxyXG5cclxuY29uc3Qgc2Nyb2xsU2VjdGlvbiA9IGRpcmVjdGlvbiA9PiB7XHJcbiAgY29uc3QgYWN0aXZlU2VjdGlvbiA9IHNlY3Rpb25zLmZpbHRlcihcIi5hY3RpdmVfc2VjdGlvblwiKTtcclxuICBjb25zdCBuZXh0U2VjdGlvbiA9IGFjdGl2ZVNlY3Rpb24ubmV4dCgpO1xyXG4gIGNvbnN0IHByZXZTZWN0aW9uID0gYWN0aXZlU2VjdGlvbi5wcmV2KCk7XHJcblxyXG4gIGlmIChuZXh0U2VjdGlvbi5sZW5ndGggJiYgZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcclxuICAgIHBlcmZvcm1UcmFuc2l0aW9uKG5leHRTZWN0aW9uLmluZGV4KCkpO1xyXG4gIH07XHJcblxyXG4gIGlmIChwcmV2U2VjdGlvbi5sZW5ndGggJiYgZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuICAgIHBlcmZvcm1UcmFuc2l0aW9uKHByZXZTZWN0aW9uLmluZGV4KCkpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiQod2luZG93KS5vbihcIndoZWVsXCIsIGUgPT4ge1xyXG4gIGNvbnN0IGRlbHRhWSA9IGUub3JpZ2luYWxFdmVudC5kZWx0YVk7XHJcblxyXG4gIGlmIChkZWx0YVkgPiAwKSB7XHJcbiAgICBzY3JvbGxTZWN0aW9uKFwibmV4dFwiKTtcclxuICB9O1xyXG5cclxuICBpZiAoZGVsdGFZIDwgMCkge1xyXG4gICAgc2Nyb2xsU2VjdGlvbihcInByZXZcIik7XHJcbiAgfTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbihcImtleWRvd25cIiwgZSA9PiB7XHJcbiAgY29uc3QgdGFnTmFtZSA9IGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgaWYgKHRhZ05hbWUgIT09IFwiaW5wdXRcIiAmJiB0YWdOYW1lICE9PSBcInRleHRhcmVhXCIgKSB7XHJcbiAgICBzd2l0Y2goZS5rZXlDb2RlKSB7XHJcbiAgICAgIGNhc2UgMzg6IFxyXG4gICAgICAgIHNjcm9sbFNlY3Rpb24oXCJwcmV2XCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDQwOiBcclxuICAgICAgICBzY3JvbGxTZWN0aW9uKFwibmV4dFwiKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9IFxyXG59KTtcclxuXHJcbiQoXCJbZGF0YS1zY3JvbGwtdG9dXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICBjb25zdCAkdGhpcyA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICBjb25zdCB0YXJnZXQgPSAkdGhpcy5hdHRyKFwiZGF0YS1zY3JvbGwtdG9cIik7XHJcbiAgcGVyZm9ybVRyYW5zaXRpb24odGFyZ2V0KTtcclxufSlcclxuXHJcbmlmIChpc01vYmlsZSkge1xyXG4gICQoXCJib2R5XCIpLnN3aXBlKHtcclxuICAgIHN3aXBlOiAoZXZlbnQsIGRpcmVjdGlvbikgPT4ge1xyXG4gICAgICBsZXQgc2Nyb2xsRGlyZWN0aW9uO1xyXG4gIFxyXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBcInVwXCIpIHNjcm9sbERpcmVjdGlvbiA9IFwibmV4dFwiO1xyXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBcImRvd25cIikgc2Nyb2xsRGlyZWN0aW9uID0gXCJwcmV2XCI7XHJcbiAgICAgIHNjcm9sbFNlY3Rpb24oc2Nyb2xsRGlyZWN0aW9uKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5jb25zdCBidXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyLW1lbnUtbGluaycpO1xyXG5jb25zdCBmaXhlZE1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGFtYnVyZ2VyLW1lbnUnKTtcclxuY29uc3QgY2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yICgnLmhhbWJ1cmdlci1tZW51X2Nsb3NlJylcclxuXHJcbmJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBmaXhlZE1lbnUuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xyXG59KVxyXG5cclxuY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZml4ZWRNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcclxufSlcclxuXHJcblxyXG5jb25zdCBsZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsZWZ0XCIpO1xyXG5jb25zdCByaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlnaHRcIik7XHJcbmNvbnN0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpdGVtc1wiKTtcclxuXHJcbnJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgbG9vcChcInJpZ2h0XCIsIGUpO1xyXG59KTtcclxuIFxyXG5sZWZ0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgbG9vcChcImxlZnRcIiwgZSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbG9vcChkaXJlY3Rpb24sIGUpIHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgaWYgKGRpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSB7XHJcbiAgICBpdGVtcy5hcHBlbmRDaGlsZChpdGVtcy5maXJzdEVsZW1lbnRDaGlsZCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGl0ZW1zLmluc2VydEJlZm9yZShpdGVtcy5sYXN0RWxlbWVudENoaWxkLCBpdGVtcy5maXJzdEVsZW1lbnRDaGlsZCk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgdGVhbUl0ZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGVhbV9uYW1lXCIpO1xyXG52YXIgYTtcclxuXHJcbmZvciAobGV0IGEgPSAwOyBhIDwgdGVhbUl0ZW0ubGVuZ3RoOyBhKyspIHtcclxuICB0ZWFtSXRlbVthXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBmb3IgKGxldCBiID0gMDsgYiA8IHRlYW1JdGVtLmxlbmd0aDsgYisrKSB7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0ZWFtSXRlbVtiXTtcclxuICAgICAgaWYgKGVsZW1lbnQgIT09IHRlYW1JdGVtW2FdKSB7XHJcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd0ZWFtX25hbWVfYWN0aXZlJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgndGVhbV9uYW1lX2FjdGl2ZScpO1xyXG4gIH0pO1xyXG4gIFxyXG59XHJcblxyXG52YXIgYWNjbWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhY2NtZW51X2l0ZW1cIik7XHJcbnZhciBpO1xyXG5cclxuZm9yIChsZXQgaT0wOyBpIDwgYWNjbWVudS5sZW5ndGg7IGkrKykge1xyXG4gICAgYWNjbWVudVtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhY2NtZW51Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICBjb25zdCBlbGVtZW50ID0gYWNjbWVudVtqXTtcclxuICAgICAgICAgIGlmIChlbGVtZW50ICE9PSBhY2NtZW51W2ldKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWNjbWVudV9pdGVtX2FjdGl2ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoXCJhY2NtZW51X2l0ZW1fYWN0aXZlXCIpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmNvbnN0IGJ1cmdlckNvbnRlbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idXJnZXJfY29udGVudHNcIilcclxuXHJcbmJ1cmdlckNvbnRlbnRzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICB2YXIgY29udGVudExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ1cmdlcl9jb250ZW50cy1saXN0XCIpO1xyXG4gIGlmIChjb250ZW50TGlzdC5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xyXG4gICAgY29udGVudExpc3Quc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb250ZW50TGlzdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICB9XHJcbn0pXHJcblxyXG5jb25zdCBvcmRlcmZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvcm1cIik7XHJcbmNvbnN0IHNlbmRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbmRcIik7XHJcbmNvbnN0IG9yZGVyT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3JkZXJfb3ZlcmxheVwiKTtcclxuY29uc3QgY2xvc2VPcmRlck92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZGVyX2Nsb3NlXCIpO1xyXG5cclxuc2VuZGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEob3JkZXJmb3JtKTtcclxuICAgICBcclxuICAgIGlmICh2YWxpZGF0ZUZvcm0ob3JkZXJmb3JtKSkge1xyXG4gICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgIG5hbWU6IG9yZGVyZm9ybS5lbGVtZW50cy5uYW1lLnZhbHVlLFxyXG4gICAgICAgIHBob25lOiBvcmRlcmZvcm0uZWxlbWVudHMucGhvbmUudmFsdWUsXHJcbiAgICAgICAgY29tbWVudDogb3JkZXJmb3JtLmVsZW1lbnRzLmNvbW1lbnQudmFsdWUsXHJcbiAgICAgICAgdG86ICdmb3gtcmFjZUBtYWlsLnJ1JyxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgayBpbiBkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoaykpIHtcclxuICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkYXRhW2tdO1xyXG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGssIGVsZW1lbnQpXHJcbiAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nXHJcbiAgICAgIHhoci5vcGVuKCdQT1NUJywgJ2h0dHBzOi8vd2ViZGV2LWFwaS5sb2Z0c2Nob29sLmNvbS9zZW5kbWFpbCcpO1xyXG4gICAgICB4aHIuc2VuZChmb3JtRGF0YSlcclxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgPT4ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChlLnRhcmdldC5yZXNwb25zZS5zdGF0dXMgPT0gMSkge1xyXG4gICAgICAgICAgb3JkZXJPdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcl9vdmVybGF5LW1lc3NhZ2UtdGV4dCcpLmlubmVyVGV4dCA9ICfQodC+0L7QsdGJ0LXQvdC40LUg0L7RgtC/0YDQsNCy0LvQtdC90L4nO1xyXG4gICAgICAgICAgb3JkZXJPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG9yZGVyT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcub3JkZXJfb3ZlcmxheS1tZXNzYWdlLXRleHQnKS5pbm5lclRleHQgPSAn0KHQvtC+0LHRidC10L3QuNC1INC90LUg0L7RgtC/0YDQsNCy0LvQtdC90L4nO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQucmVzcG9uc2Uuc3RhdHVzKTtcclxuICAgICAgICAgIG9yZGVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfTtcclxufSlcclxuXHJcbmNsb3NlT3JkZXJPdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBvcmRlck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufSlcclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlRm9ybShmb3JtKSB7XHJcbiAgbGV0IHZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgaWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMubmFtZSkpIHtcclxuICAgIHZhbGlkID0gZmFsc2U7XHJcbiAgfVxyXG4gIGlmICghdmFsaWRhdGVGaWVsZChmb3JtLmVsZW1lbnRzLnBob25lKSkge1xyXG4gICAgdmFsaWQgPSBmYWxzZTtcclxuICB9XHJcbiAgaWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMuY29tbWVudCkpIHtcclxuICAgIHZhbGlkID0gZmFsc2U7XHJcbiAgfVxyXG4gIGNvbnNvbGUubG9nKHZhbGlkKTtcclxuICByZXR1cm4gdmFsaWRcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVGaWVsZChmaWVsZCkge1xyXG4gIGlmICghZmllbGQuY2hlY2tWYWxpZGl0eSgpKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHRydWVcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHJldmlld092ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3X292ZXJsYXknKTtcclxuY29uc3QgY2xvc2VSZXZpZXdPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld19tZXNzYWdlLWNsb3NlJyk7XHJcbnZhciByZXZpZXdCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJldmlld19idG4nKTtcclxuXHJcbmZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCByZXZpZXdCdG5zLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gIGNvbnN0IGVsZW1lbnQgPSByZXZpZXdCdG5zW2luZGV4XTtcclxuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHVzZXIgPSBlLnRhcmdldC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdfdXNlcm5hbWUnKS5pbm5lclRleHQ7XHJcbiAgICBjb25zdCB0ZXh0ID0gZS50YXJnZXQucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3X3RleHQnKS5pbm5lclRleHQ7XHJcblxyXG4gICAgcmV2aWV3T3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3X3VzZXItb3ZlcmxheScpLmlubmVyVGV4dCA9IHVzZXI7XHJcbiAgICByZXZpZXdPdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdfdGV4dC1vdmVybGF5JykuaW5uZXJUZXh0ID0gdGV4dDtcclxuICAgIHJldmlld092ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICB9KVxyXG59XHJcblxyXG5jbG9zZVJldmlld092ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICByZXZpZXdPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbn0pXHJcblxyXG5cclxueW1hcHMucmVhZHkoaW5pdCk7XHJcbiAgICBcclxuZnVuY3Rpb24gaW5pdCgpe1xyXG4gICAgICAgIHZhciBteU1hcCA9IG5ldyB5bWFwcy5NYXAoXCJtYXBcIiwge1xyXG4gICAgICAgICAgICBjZW50ZXI6IFs1OS45NDcyNzkzMzUyOTgxNSwzMC4zMTg1Nzk2MDQ4OTI0Ml0sXHJcbiAgICAgICAgICAgIHpvb206IDExXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBteVBsYWNlbWFyazEgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKFs1OS45ODk3MjkyMDUwNDE4NTQsMzAuMjY2OTAzMDkwOTgyNzEyXSwge30sIHtcclxuICAgICAgICAgIGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuICAgICAgICAgIGljb25JbWFnZUhyZWY6ICcvaW1nL2ljb25zL21hcC1tYXJrZXIuc3ZnJyxcclxuICAgICAgICAgIGljb25JbWFnZVNpemU6IFs0NiwgNTddLFxyXG4gICAgICAgICAgaWNvbkltYWdlT2Zmc2V0OiBbLTIzLCAtNTddXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG15TWFwLmdlb09iamVjdHMuYWRkKG15UGxhY2VtYXJrMSk7XHJcblxyXG4gICAgICAgIHZhciBteVBsYWNlbWFyazIgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKFs1OS45MTU2NTI0MTA1ODMyNCwzMC40OTQyNzg2OTQ4MjYxNDZdLCB7fSwge1xyXG4gICAgICAgICAgaWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxyXG4gICAgICAgICAgaWNvbkltYWdlSHJlZjogJy9pbWcvaWNvbnMvbWFwLW1hcmtlci5zdmcnLFxyXG4gICAgICAgICAgaWNvbkltYWdlU2l6ZTogWzQ2LCA1N10sXHJcbiAgICAgICAgICBpY29uSW1hZ2VPZmZzZXQ6IFstMjMsIC01N11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbXlNYXAuZ2VvT2JqZWN0cy5hZGQobXlQbGFjZW1hcmsyKTtcclxuXHJcbiAgICAgICAgdmFyIG15UGxhY2VtYXJrMyA9IG5ldyB5bWFwcy5QbGFjZW1hcmsoWzU5Ljk0NTI0NTYyMTA4Njg1LDMwLjM4MjY0NjEyMjQ4OTQyXSwge30sIHtcclxuICAgICAgICAgIGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuICAgICAgICAgIGljb25JbWFnZUhyZWY6ICcvaW1nL2ljb25zL21hcC1tYXJrZXIuc3ZnJyxcclxuICAgICAgICAgIGljb25JbWFnZVNpemU6IFs0NiwgNTddLFxyXG4gICAgICAgICAgaWNvbkltYWdlT2Zmc2V0OiBbLTIzLCAtNTddXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG15TWFwLmdlb09iamVjdHMuYWRkKG15UGxhY2VtYXJrMyk7XHJcblxyXG4gICAgICAgIHZhciBteVBsYWNlbWFyazQgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKFs1OS44ODg5NTcwOTMyNDkxMiwzMC4zMTYwNDE1MDgyMzE2MTNdLCB7fSwge1xyXG4gICAgICAgICAgaWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxyXG4gICAgICAgICAgaWNvbkltYWdlSHJlZjogJy9pbWcvaWNvbnMvbWFwLW1hcmtlci5zdmcnLFxyXG4gICAgICAgICAgaWNvbkltYWdlU2l6ZTogWzQ2LCA1N10sXHJcbiAgICAgICAgICBpY29uSW1hZ2VPZmZzZXQ6IFstMjMsIC01N11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbXlNYXAuZ2VvT2JqZWN0cy5hZGQobXlQbGFjZW1hcms0KTtcclxuIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4iXX0=
