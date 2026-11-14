const STORAGE_KEY = "contempiso-orders-v1";
const screens = ["home", "newOrder", "orders"];
let orders = loadOrders();

function loadOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.warn("Não foi possível ler os pedidos salvos.", error);
  }
  return [
    {
      id: "CP-001",
      client: "Maria Oliveira",
      phone: "",
      address: "Rua Paraná, 250 - Centro",
      slabType: "Laje treliçada",
      area: 72,
      date: futureDate(4),
      status: "Em fabricação"
    },
    {
      id: "CP-002",
      client: "Carlos Mendes",
      phone: "",
      address: "Av. das Araucárias, 80",
      slabType: "Laje convencional",
      area: 55,
      date: futureDate(2),
      status: "Agendado"
    }
  ];
}

function futureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function saveOrders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function showScreen(screenName) {
  screens.forEach(name => {
    document.getElementById(`${name}Screen`).classList.toggle("active", name === screenName);
  });
  document.querySelectorAll("[data-screen]").forEach(button => {
    if (button.classList.contains("nav-item")) {
      button.classList.toggle("active", button.dataset.screen === screenName);
    }
  });
  if (screenName === "home") updateDashboard();
  if (screenName === "orders") renderOrders();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-screen]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

function updateDashboard() {
  document.getElementById("inProgressCount").textContent =
    orders.filter(order => order.status === "Em fabricação").length;
  document.getElementById("scheduledCount").textContent =
    orders.filter(order => order.status === "Agendado").length;

  const next = orders
    .filter(order => order.status === "Agendado")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  document.getElementById("nextInstall").textContent = next
    ? `${next.client} — ${formatDate(next.date)} (${next.address}).`
    : "Nenhuma instalação agendada.";
}

function formatDate(value) {
  if (!value) return "Data não informada";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll(".field").forEach(field => {
    field.classList.remove("invalid");
    const error = field.querySelector(".field-error");
    if (error) error.textContent = "";
    const input = field.querySelector("input, select");
    if (input && input.required && !input.value.trim()) {
      valid = false;
      field.classList.add("invalid");
      if (error) error.textContent = "Preencha este campo.";
    }
    if (input && input.name === "area" && input.value && Number(input.value) <= 0) {
      valid = false;
      field.classList.add("invalid");
      if (error) error.textContent = "Informe uma metragem maior que zero.";
    }
  });
  return valid;
}

document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById("formMessage");
  message.textContent = "";
  message.className = "form-message";

  if (!validateForm(form)) {
    message.textContent = "Revise os campos destacados antes de salvar.";
    message.classList.add("error");
    form.querySelector(".field.invalid input, .field.invalid select")?.focus();
    return;
  }

  const data = new FormData(form);
  const nextNumber = orders.reduce((max, order) => {
    const number = Number((order.id.match(/(\d+)$/) || [0, 0])[1]);
    return Math.max(max, number);
  }, 0) + 1;

  const order = {
    id: `CP-${String(nextNumber).padStart(3, "0")}`,
    client: data.get("client").trim(),
    phone: data.get("phone").trim(),
    address: data.get("address").trim(),
    slabType: data.get("slabType"),
    area: Number(data.get("area")),
    date: data.get("date"),
    status: "Em fabricação"
  };

  orders.unshift(order);
  saveOrders();
  form.reset();
  message.textContent = `Pedido ${order.id} salvo com sucesso!`;
  message.classList.add("success");
  showToast("Pedido cadastrado com sucesso.");
  renderOrders();
  window.setTimeout(() => showScreen("orders"), 650);
});

document.getElementById("cancelOrder").addEventListener("click", () => {
  document.getElementById("orderForm").reset();
  document.getElementById("formMessage").textContent = "";
  showScreen("home");
});

function renderOrders() {
  const container = document.getElementById("ordersList");
  const query = document.getElementById("searchOrders").value.trim().toLowerCase();
  const filtered = orders.filter(order =>
    order.client.toLowerCase().includes(query) ||
    order.address.toLowerCase().includes(query) ||
    order.id.toLowerCase().includes(query)
  );

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state"><strong>Nenhum pedido encontrado</strong><p>Verifique o termo buscado ou cadastre um novo pedido.</p></div>`;
    updateDashboard();
    return;
  }

  container.innerHTML = filtered.map(order => {
    const statusClass = order.status === "Agendado" ? "agendado" :
      order.status === "Instalado" ? "instalado" : "fabricacao";
    return `
      <article class="order-card">
        <div class="order-card-top">
          <div><h3>${escapeHTML(order.client)}</h3><p class="order-id">${escapeHTML(order.id)}</p></div>
          <span class="status ${statusClass}">${escapeHTML(order.status)}</span>
        </div>
        <div class="order-meta">
          <span><strong>Endereço</strong>${escapeHTML(order.address)}</span>
          <span><strong>Instalação desejada</strong>${formatDate(order.date)}</span>
          <span><strong>Tipo de laje</strong>${escapeHTML(order.slabType)}</span>
          <span><strong>Metragem</strong>${Number(order.area).toLocaleString("pt-BR")} m²</span>
        </div>
        <div class="order-card-actions">
          <label class="sr-only" for="status-${escapeHTML(order.id)}">Atualizar situação do pedido ${escapeHTML(order.id)}</label>
          <select class="status-select" id="status-${escapeHTML(order.id)}" data-order-id="${escapeHTML(order.id)}">
            ${["Em fabricação", "Agendado", "Instalado"].map(status =>
              `<option ${order.status === status ? "selected" : ""}>${status}</option>`
            ).join("")}
          </select>
        </div>
      </article>`;
  }).join("");

  container.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", event => {
      const order = orders.find(item => item.id === event.target.dataset.orderId);
      if (!order) return;
      order.status = event.target.value;
      saveOrders();
      renderOrders();
      showToast("Situação do pedido atualizada.");
    });
  });
  updateDashboard();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

document.getElementById("searchOrders").addEventListener("input", renderOrders);
document.getElementById("refreshOrders").addEventListener("click", () => {
  orders = loadOrders();
  renderOrders();
  showToast("Lista atualizada.");
});

const dialog = document.getElementById("notificationDialog");
document.getElementById("notificationsBtn").addEventListener("click", () => {
  const next = orders
    .filter(order => order.status === "Agendado")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  document.getElementById("notificationText").textContent = next
    ? `Próxima instalação: ${next.client}, em ${formatDate(next.date)}. Endereço: ${next.address}.`
    : "Não há instalações agendadas no momento.";
  dialog.showModal();
});
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());

updateDashboard();
