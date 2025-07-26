document.addEventListener("DOMContentLoaded", () => {
  // Rolagem suave para links de navegação
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)
      const headerOffset = document.querySelector(".header").offsetHeight
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerOffset - 20

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    })
  })

  // Expansão do Cartão do Catálogo
  const expandButtons = document.querySelectorAll(".catalog-card .expand-button")

  expandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const cardContent = button.closest(".card-content")
      const cardDescription = cardContent.querySelector(".card-description")

      // Verifica se o botão clicado já está ativo
      const isCurrentlyActive = button.classList.contains("active")

      // Fecha todos os outros cartões abertos
      expandButtons.forEach((otherButton) => {
        const otherCardContent = otherButton.closest(".card-content")
        const otherCardDescription = otherCardContent.querySelector(".card-description")

        if (otherButton.classList.contains("active")) {
          otherButton.classList.remove("active")
          otherButton.setAttribute("aria-expanded", "false")
          otherCardDescription.classList.remove("active")
        }
      })

      // Se o botão clicado não estava ativo, ative-o
      if (!isCurrentlyActive) {
        button.classList.add("active")
        cardDescription.classList.add("active")
        button.setAttribute("aria-expanded", "true")
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
  // Valores menores significam mais atraso, valores maiores significam menos atraso
  const lerpFactor = 0.1 // Experimente com este valor (ex: 0.08 para mais atraso, 0.15 para menos)

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
})