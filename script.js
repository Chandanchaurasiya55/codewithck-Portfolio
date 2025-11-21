<<<<<<< HEAD
// Tailwind configuration for custom colors/theme - Dark Mode Palette
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#1f2937",   // Dark Slate (Main Content Background)
        secondary: "#f59e0b", // Amber/Gold (Main Accent)
        accent: "#f59e0b",    // Used for action buttons and highlights
        "dark-bg": "#030712", // Deepest Black (Body/Hero Background)
      },
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // ================= NAVBAR ACTIVE LINK =================
  const navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink(activeLink) {
    navLinks.forEach((link) => {
      // sab links normal state
      link.classList.remove("text-secondary", "border-b-2", "border-secondary");
      if (!link.classList.contains("text-gray-400")) {
        link.classList.add("text-gray-400");
      }
    });

    // jis link pe click hua usko active
    activeLink.classList.remove("text-gray-400");
    activeLink.classList.add("text-secondary", "border-b-2", "border-secondary");
  }

  if (navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setActiveLink(link);
      });
    });
    // NOTE: yahan Home ko default active nahi kar rahe
  }

  // ============== SMOOTH SCROLL ==============
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetSelector = this.getAttribute("href");
      const target = document.querySelector(targetSelector);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // ============== MOBILE MENU TOGGLE ==============
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ============== TYPEWRITER EFFECT ==============
  const textElement = document.getElementById("typewriter-text");
  const roles = [" Web Developer", "MERN Stack Developer"];
  let roleIndex = 0;
  let charIndex = 0;
  const typingSpeed = 100; // ms
  const erasingSpeed = 50; // ms
  const pauseTime = 1500; // ms before starting erase/next word

  function type() {
    if (!textElement) return;

    if (charIndex < roles[roleIndex].length) {
      textElement.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, pauseTime);
    }
  }

  function erase() {
    if (!textElement) return;

    if (charIndex > 0) {
      textElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, typingSpeed);
    }
  }

  if (textElement) {
    textElement.classList.add("typewriter-cursor");
    type();
  }

  // ============== CONTACT FORM (DEMO) ==============
  const contactForm = document.getElementById("contact-form");
  const statusMessage = document.getElementById("status-message");

  if (contactForm && statusMessage) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      statusMessage.textContent =
        "Thank you for your message! (Form submission is disabled in this demo)";
      statusMessage.classList.remove("hidden");
      statusMessage.classList.add("text-accent");
      setTimeout(() => {
        statusMessage.classList.add("hidden");
        contactForm.reset();
      }, 3000);
    });
  }
});

// Copy to clipboard helper (email / phone)
function copyToClipboard(textToCopy, elementId) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    const statusElement = document.getElementById(elementId);
    if (statusElement) {
      const originalText = statusElement.textContent;
      statusElement.textContent = "Copied!";
      statusElement.classList.remove("text-secondary");
      statusElement.classList.add("text-accent");

      setTimeout(() => {
        if (statusElement.textContent === "Copied!") {
          statusElement.textContent = originalText;
        }
        statusElement.classList.remove("text-accent");
        statusElement.classList.add("text-secondary");
      }, 1500);
    }
  } catch (err) {
    console.error("Could not copy text: ", err);
  }
}
=======


function Rerite_text(){
    var typed = new Typed((".ck"),{
        strings : ["Full Stack Developer","Web Designer", "Ui/Ux Designer"],
        typeSpeed : 100,
        backSpeed : 100,
        backDelay : 1000,
        loop :true
    })
    var typed = new Typed((".chandan"),{
        strings : ["Chandan Chaurasiya"],
        typeSpeed : 100,
        backSpeed : 100,
        backDelay : 1000,
        loop :true
    })
    
}

function navbar_active(){
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach(link => {
    link.addEventListener('click', function () {
    navLinks.forEach(el => el.classList.remove('active-link')); // remove from all
    this.classList.add('active-link'); // add to clicked one
  });
});

}

function FormHandller(){
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("contact-form");
      
        form.addEventListener("submit", function (e) {
          e.preventDefault();
      
          const name = form.name.value.trim();
          const email = form.email.value.trim();
          const message = form.message.value.trim();
      
          // Basic validation
          if (!name || !email || !message) {
            alert("Please fill out all fields before submitting.");
            return;
          }
      
          // Optional: Email format validation
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
          }
      
          // Simulate form submission (replace this with a real API call)
          alert("Thank you for reaching out, " + name + "! I'll get back to you soon.");
          form.reset(); // Clear form after submission
        });
      });    
}







// Call the functions to initialize them
Rerite_text();
navbar_active();
FormHandller();
>>>>>>> 2cf81970c92807afd11d7df90e36e99c173a58ce
