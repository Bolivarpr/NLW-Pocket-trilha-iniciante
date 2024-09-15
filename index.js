const { select, input, checkbox } = require('@inquirer/prompts')

    //puxando o arquivo json
const fs = require("fs").promises

    // puxar a mensagem de inicio no App
let mensagem = "Seja-Bem-Vindo(a) ao App de Metas"

let metas 

    // carregar as metas
const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }

    catch(erro) {
        metas = []
    }
}
    // salvar as metas
const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

    // puxar a opção cadastrar metas
const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta:"}) 

    // mostra a mensagem da ação não realizada
    if(meta.length ==0) {
        mensagem = 'A meta não pode ser vazia.'
        return
    }

    // colocar em metas
    metas.push(
        {value: meta, checked: false }
    )
    

    mensagem = "Meta cadastrada com sucesso!"
}
    // puxar a opção listar metas
const listarMetas = async () => {

    //informar que não existe metas no arquivo JSON
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    // puxar a opção listar metas
    const respostas =  await checkbox ({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    //desmarcar as metas
    metas.forEach((m) => {
        m.checked = false
    })

    // mostra a mensagem da ação não realizada
    if(respostas.length == 0){
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    // marcar as metas
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
    
        meta.checked = true
    })

    mensagem ='Meta(s) marcada(s) como concluída(s)'

}
    // puxar a opção meta realizadas
const metasrealizadas = async () => {

    //informar que não existe metas no arquivo JSON
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    // puxar a opção meta realizadas
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    // mostra a mensagem da ação não realizada
    if(realizadas.length ==0){
        mensagem = 'Não existem metas realizadas! :('
            return
    }

    // mostra quantas metas realizadas
            await select({
                message: "Metas Realizadas: " + realizadas.length,
                choices: [...realizadas],
                
            })

}
    // puxar a opção metas abertas
const metasabertas = async () => {

    //informar que não existe metas no arquivo JSON
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    // puxar a opção metas abertas
    const abertas = metas.filter ((meta) => {
        return meta.checked != true
    })

    // mostra a mensagem da ação não realizada
    if(abertas.length ==0) {
        mensagem = "Não existem metas abertas! :)"
        return
    }
    // mostra quantas metas abertas
    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
}

    // puxar a opção remover metas
const removermetas = async () => {

    //informar que não existe metas no arquivo JSON
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    // puxar a opção remover metas
    const metasRemovidas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })
    
    // mostrar mensagem para realizar uma ação
    const itensremovidos =  await checkbox ({
        message: "selecione uma meta para remover",
        choices: [...metas],
        instructions: false,
    })
    // mostra a mensagem da ação realizada
    if(itensremovidos.length == 0) {
        mensagem = "Nenhum item para remover!"
            return
    }
        // remover as meta(s)
    itensremovidos.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) removida(s) com sucesso!"

}
    // coletou  processou e apresentou  dados,Fazer com que apareceça as mensagens dos itens do menu

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

    // começar a aplicação
const start = async () => {
    //carregar ou ler as metas
    await carregarMetas()
    // colocar nomes na lista do menu
    while (true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastra"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Remover metas",
                    value: "remover"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        // puxar as opções do menu
        switch(opcao) {

            case "cadastra":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasrealizadas()
                break 
            case "abertas":
                await metasabertas()
                break  
            case "remover":
                await removermetas()
                break 
            case "sair":
                console.log("Até a próxima!")
            return    
        }
    }
}

    // começar a aplicação
start()