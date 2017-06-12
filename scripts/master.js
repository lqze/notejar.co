/* All code here is written under the MIT License
 * Author: Caleb Fetzer
 * Feel free to use and distribute any of the code.
 * Purposefully unminimalised.
 */

/* ===================================
 * Text 'Typewriter' effect function.
 * Adapted from user "Tachun Lin", Stack Overflow
 * http://stackoverflow.com/questions/22180457/typewriter-effect-for-html-with-javascript
 */

const list = ["LANGUAGES", // List of sentences you want to print to screen.
  "PROGRAMMING",
  "SELF DEVELOPMENT",
  "WILLKOMMEN",
  "ÜDVÖZÖLJÜK",
  "WELCOME",
  "PERTH, WESTERN AUSTRALIA",
  "echo \"I hope you enjoy your stay.\""
];

let text = "",
  i = 0,
  n = 0;
const cursorBlinkRate = 530; // Default cursor blink rate

// Average Character Per Minute speed is 190 CPM, roughly 3 chars per second.
// Programmers are a little faster ;)
let writeSpeed = getRandomInt(100, 210);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  result = Math.floor(Math.random() * (max - min)) + min;
  return result;
}

// This function prints text to a html element.
function writeText() {
  if (n === list.length) n = 0; // Resets the typing loop.
  text += list[n][i];
  document.getElementById('typewriter').innerHTML = text;
  if (text === list[n]) {
    // Holds the string for 8 seconds, then begins deleting.
    setTimeout(deleteText, 8000);
    return;
  }
  ++i;
  setTimeout(writeText, writeSpeed);
}

function deleteText() {
  text = text.slice(0, --i);
  document.getElementById('typewriter').innerHTML = text;
  if (text === "") {
    n++;
    setTimeout(writeText, 1000);
    return;
  }
  // Deleting text is quicker than typing.
  setTimeout(deleteText, 120);
}

// Repeatedly blinks the cursor icon and
// simulates a console blinking cursor effect.
function animateCursor() {
  document.getElementById('cursor').classList.toggle("active__element");
  setTimeout(animateCursor, cursorBlinkRate);
}

document.addEventListener("DOMContentLoaded", function() {
  // we don't want these functions to try and run if there is no element!
  if (document.getElementById('typewriter')) {
    writeText();
    animateCursor();
  }
  preFrmSubmit();
});

/* ---- * * * * * * * * * * * * * * * * * * * * * * * * * * * * ---- */

/*
 * This function toggles the active element on the navigation
 * It lets the user know which nav link is active.
 * Needs to be revised.
 */

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.href.indexOf("about") != -1) {
    document.getElementById('liabout').classList.add("active");
    document.getElementById('lihome').classList.toggle("active");
  } else if (window.location.href.indexOf("2") != -1) {
    document.getElementById('lihome').classList.remove("active");
    document.getElementById('liabout').classList.remove("active");
  }
});


/*
 * This function just enables the form once some input is recognised in both fields.
 *
 */

function preFrmSubmit() {
  // grab our selectors
  const p = document.getElementById('p-support');

  const contactFrm = document.querySelector('.contact-form');
  const button = contactFrm.querySelector('button');
  const msg = contactFrm.querySelector('textarea');
  const email = contactFrm.querySelector('input');

  let containsMsgTxt = false;
  let containsEmailTxt = false;

  function enableBtn() {
    button.removeAttribute("disabled");
    button.classList.remove("u-disabled");
  }

  msg.addEventListener("keypress", () => {
    containsMsgTxt = true;
    checkEnable();
    return containsMsgTxt;
  });

  email.addEventListener("keypress", () => {
    containsEmailTxt = true;
    checkEnable();
    return containsEmailTxt;
  });

  function checkEnable() {
    if (!(containsMsgTxt) || !(containsEmailTxt)) {
      p.classList.remove('u-hidden');
      p.innerHTML = 'Please fill out both of the fields.';
    } else {
      enableBtn();
      p.innerHTML = 'Thank you, I will try get back to you ASAP!';
    }
  }
}






/*
 * Konami Code..
 * Welcome back: TWIN PEAKS
 * Hello to all reading this :)
 */

const pressed = [];
const secretCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
window.addEventListener('keyup', (e) => {
  var audio = new Audio('/assets/damngood.mp3')
  pressed.push(e.key);
  pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length);
  if (pressed.join('').includes(secretCode)) {
    audio.play(); // Damn fine, indeed.
    document.body.style.backgroundImage = "url('/assets/img/coop.jpg')";
    pressed.length = 0;
  }
})
