import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");

async function iniciarAplicacao() {
  localStorage.clear();

  const pagina = new DOMParser().parseFromString(html, "text/html");
  document.documentElement.innerHTML = pagina.documentElement.innerHTML;

  window.scrollTo = vi.fn();

  vi.resetModules();
  await import("../app.js");
}

describe("Testes do CONTEMPISO", () => {
  beforeEach(async () => {
    await iniciarAplicacao();
  });

  it("deve carregar o painel com os pedidos iniciais", () => {
    expect(document.getElementById("inProgressCount").textContent).toBe("1");
    expect(document.getElementById("scheduledCount").textContent).toBe("1");
  });

  it("deve impedir o envio de formulário vazio", () => {
    const form = document.getElementById("orderForm");

    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );

    expect(document.getElementById("formMessage").textContent)
      .toContain("Revise os campos");
  });

  it("deve exibir os pedidos cadastrados", () => {
    document.querySelector('[data-screen="orders"]').click();

    expect(document.querySelectorAll(".order-card").length).toBe(2);
  });

  it("deve filtrar pedidos pela pesquisa", () => {
    document.querySelector('[data-screen="orders"]').click();

    const search = document.getElementById("searchOrders");
    search.value = "Maria";
    search.dispatchEvent(new Event("input", { bubbles: true }));

    expect(document.querySelectorAll(".order-card").length).toBe(1);
    expect(document.getElementById("ordersList").textContent).toContain("Maria Oliveira");
  });

  it("deve atualizar o status e salvar a alteração", () => {
    document.querySelector('[data-screen="orders"]').click();

    const status = document.querySelector(".status-select");
    status.value = "Instalado";
    status.dispatchEvent(new Event("change", { bubbles: true }));

    const pedidos = JSON.parse(localStorage.getItem("contempiso-orders-v1"));

    expect(pedidos[0].status).toBe("Instalado");
  });
});
