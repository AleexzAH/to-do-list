$(document).ready(function () {
    const storageKey = "tarefasSemana";

    function salvarLocalStorage() {
        const dados = {};
        $(".dia").each(function () {
            const id = $(this).attr("id");
            dados[id] = [];
            $(this).find("li").each(function () {
                dados[id].push({
                    texto: $(this).find("p").first().text(),
                    categoria: $(this).attr("class").replace("riscado", "").trim(),
                    riscado: $(this).hasClass("riscado")
                });
            });
        });
        localStorage.setItem(storageKey, JSON.stringify(dados));
    }

    function carregarLocalStorage() {
        const dados = JSON.parse(localStorage.getItem(storageKey)) || {};
        for (const dia in dados) {
            dados[dia].forEach(tarefa => adicionarTarefa(tarefa.texto, tarefa.categoria, dia, tarefa.riscado));
        }
    }

    function adicionarTarefa(texto, categoria, dia, riscado = false) {
        const li = $(`<li class="${categoria}"></li>`);
        const pTexto = $(`<p>${texto}</p>`);
        const pCategoria = $(`<p>${categoria}</p>`);
        const checkbox = $('<input type="checkbox">');
        const btnEditar = $('<button>✏️</button>');
        const btnExcluir = $('<button>🗑️</button>');

        if (riscado) {
            li.addClass("riscado");
            checkbox.prop("checked", true);
        }

        checkbox.change(function () {
            li.toggleClass("riscado");
            atualizarProgresso(dia);
            salvarLocalStorage();
        });

        btnEditar.click(function () {
            const novoTexto = prompt("Editar tarefa:", pTexto.text());
            if (novoTexto) {
                pTexto.text(novoTexto);
                salvarLocalStorage();
            }
        });

        btnExcluir.click(function () {
            li.remove();
            atualizarProgresso(dia);
            salvarLocalStorage();
        });

        li.append(pTexto, pCategoria, checkbox, btnEditar, btnExcluir).hide().fadeIn(500);
        $(`#${dia} .lista-tarefas`).append(li);
        atualizarProgresso(dia);
    }

    $('#botao-principal').click(function (e) {
        e.preventDefault();
        const texto = $('#inputTarefa').val().trim();
        const categoria = $('#meuSelect').val();
        const dia = $('#diaSemana').val();

        if (texto === '') {
            alert("Digite uma tarefa válida.");
            return;
        }

        adicionarTarefa(texto, categoria, dia);
        $('#inputTarefa').val('');
        salvarLocalStorage();
        filtrarTarefas();
    });

    $('.filtro-categoria').change(filtrarTarefas);

    function filtrarTarefas() {
        const selecionadas = $('.filtro-categoria:checked').map(function () {
            return this.value;
        }).get();

        $('.lista-tarefas li').each(function () {
            const categoria = $(this).attr('class').split(' ')[0];
            $(this).toggle(selecionadas.includes(categoria));
        });
    }

    function atualizarProgresso(dia) {
        const lista = $(`#${dia} .lista-tarefas`);
        const total = lista.find('li').length;
        const concluidas = lista.find('input:checked').length;
        const porcentagem = total === 0 ? 0 : Math.round((concluidas / total) * 100);
        $(`#${dia} .progress-bar`).css('width', `${porcentagem}%`);
    }

    $('#toggle-theme').click(function () {
        $('body').toggleClass('dark-mode');
        const modoAtual = $('body').hasClass('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', modoAtual);
    });

    function carregarTema() {
        const tema = localStorage.getItem('theme');
        if (tema === 'dark') {
            $('body').addClass('dark-mode');
        }
    }

    carregarTema();
    carregarLocalStorage();
});