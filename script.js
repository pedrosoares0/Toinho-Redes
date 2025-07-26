document.addEventListener("DOMContentLoaded", () => {
  // Rolagem suave para links de navegação
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)
      const headerOffset = document.querySelector(".header").offsetHeight
      const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset - 20

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    })
  })

  // Rolagem para o topo ao clicar na logo
  document.querySelector(".nav-logo-link").addEventListener("click", (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Expansão do Cartão do Catálogo
  const expandButtons = document.querySelectorAll(".catalog-card .expand-button")

  expandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".catalog-card")
      const isCurrentlyExpanded = card.classList.contains("expanded")

      // Fecha todos os outros cartões abertos
      document.querySelectorAll(".catalog-card.expanded").forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove("expanded")
          openCard.querySelector(".expand-button").classList.remove("active")
          openCard.querySelector(".expand-button").setAttribute("aria-expanded", "false")
        }
      })

      // Alterna o estado do cartão clicado
      if (!isCurrentlyExpanded) {
        card.classList.add("expanded")
        button.classList.add("active")
        button.setAttribute("aria-expanded", "true")
      } else {
        card.classList.remove("expanded")
        button.classList.remove("active")
        button.setAttribute("aria-expanded", "false")
      }
    })
  })

  // Acordeão de FAQ
  const faqQuestions = document.querySelectorAll(".faq-question")

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.closest(".faq-item")
      const faqAnswer = faqItem.querySelector(".faq-answer")

      // Verifica se a pergunta clicada já está ativa
      const isCurrentlyActive = question.classList.contains("active")

      // Fecha todas as outras respostas abertas
      faqQuestions.forEach((otherQuestion) => {
        if (otherQuestion !== question && otherQuestion.classList.contains("active")) {
          otherQuestion.classList.remove("active")
          otherQuestion.setAttribute("aria-expanded", "false")
          otherQuestion.closest(".faq-item").querySelector(".faq-answer").classList.remove("active")
        }
      })

      // Se a pergunta clicada não estava ativa, ative-a
      if (!isCurrentlyActive) {
        question.classList.add("active")
        faqAnswer.classList.add("active")
        question.setAttribute("aria-expanded", "true")
      }
    })
  })

  // Animações de Seção ao Rolar (Intersection Observer)
  const animatedSections = document.querySelectorAll(".animated-section")

  const observerOptions = {
    root: null, // viewport como raiz
    rootMargin: "0px",
    threshold: 0.2, // 20% da seção visível para animar
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      } else {
        entry.target.classList.remove("visible")
      }
    })
  }, observerOptions)

  animatedSections.forEach((section) => {
    observer.observe(section)
  })

  // Lógica do Cursor Personalizado
  const customCursor = document.querySelector(".custom-cursor")
  const footerSection = document.querySelector(".footer-section") // Obtém referência ao rodapé

  let currentX = 0
  let currentY = 0
  let targetX = 0
  let targetY = 0

  // Define o fator de interpolação (quão rápido o cursor alcança)
  const lerpFactor = 0.1

  // Função para atualizar a posição do cursor
  function animateCursor() {
    // Interpola a posição atual em direção à posição alvo
    currentX += (targetX - currentX) * lerpFactor
    currentY += (targetY - currentY) * lerpFactor

    // Aplica a posição interpolada usando transform para melhor desempenho
    customCursor.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px)`

    // Solicita o próximo quadro
    requestAnimationFrame(animateCursor)
  }

  // Inicia o loop de animação
  animateCursor()

  // Atualiza a posição alvo no movimento do mouse
  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX
    targetY = e.clientY

    // Determina se o mouse está sobre um elemento interativo
    const isOverInteractive = e.target.closest("a, button, .nav-link, .catalog-card, .number-card, .faq-item")

    // Determina se o mouse está sobre o rodapé
    const isOverFooter = footerSection && footerSection.contains(e.target)

    // Aplica o estilo do cursor com base nas condições
    if (isOverFooter) {
      customCursor.style.backgroundColor = "white" // Branco no rodapé escuro
      customCursor.style.width = isOverInteractive ? "20px" : "10px"
      customCursor.style.height = isOverInteractive ? "20px" : "10px"
    } else if (isOverInteractive) {
      customCursor.style.backgroundColor = "var(--cor-destaque)" // Cor de destaque em elementos interativos
      customCursor.style.width = "20px"
      customCursor.style.height = "20px"
    } else {
      customCursor.style.backgroundColor = "var(--cor-texto-principal)" // Preto padrão
      customCursor.style.width = "10px"
      customCursor.style.height = "10px"
    }
  })

  // Animação dos cards da seção "Números" ao rolar
  const numberCards = document.querySelectorAll(".numbers-grid .number-card")

  const numberCardObserverOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // 50% do card visível para animar
  }

  const numberCardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        observer.unobserve(entry.target) // Para animar apenas uma vez
      }
    })
  }, numberCardObserverOptions)

  numberCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s` // Atraso escalonado
    numberCardObserver.observe(card)
  })

  // Lógica do Menu Mobile
  const mobileMenuButton = document.querySelector(".mobile-menu-button")
  const closeMenuButton = document.querySelector(".close-menu-button")
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

  if (mobileMenuButton && mobileNavOverlay && closeMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      mobileNavOverlay.classList.add("open")
      document.body.style.overflow = "hidden" // Previne rolagem do corpo
    })

    closeMenuButton.addEventListener("click", () => {
      mobileNavOverlay.classList.remove("open")
      document.body.style.overflow = "" // Restaura rolagem do corpo
    })

    mobileNavOverlay.addEventListener("click", (e) => {
      if (e.target === mobileNavOverlay) {
        mobileNavOverlay.classList.remove("open")
        document.body.style.overflow = ""
      }
    })

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavOverlay.classList.remove("open")
        document.body.style.overflow = ""
      })
    })
  }
})
