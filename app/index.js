const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,
}
let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta:"})

    if(meta.length ==0) {
        console.log('A meta não pode ser vazia.')
        return
    }

    metas.push(
        {value: meta, checked: false }
    )

}
    // para listar metas
const listarMetas = async () => {
    const respostas =  await checkbox ({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    //desmarcar as metas
    metas.forEach((m) => {
        m.checked = false
    })

    // para mostrar que não foi selecionado
    if(respostas.length == 0){
        console.log("Nenhuma meta selecionada!")
        return
    }

    //marcar as metas
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
    
        meta.checked = true
    })

    console.log('Meta(s) marcadas como concluída(s)')

}
        // puxar a opção meta realizadas
const metasrealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length ==0){
        console.log('Não existem metas realizadas! :(')
            return
    }
            await select({
                message: "Metas Realizadas " + realizadas.length,
                choices: [...realizadas],
                
            })

}
    //puxar a opção metasabertas
const metasabertas = async () => {
    const abertas = metas.filter ((meta) => {
        return meta.checked != true
    })

    if(abertas.length ==0) {
        console.log("Não existem metas abertas! :)")
        return
    }

    await select({
        message: "Metas Abertas " + abertas.length,
        choices: [...abertas]
    })
}

        //colocar nomes da lista do menu 
const start = async () => {
   
    while (true){

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "cadastrar meta",
                    value: "cadastra"
                },
                {
                    name: "listar metas",
                    value: "listar"
                },
                {
                    name: "metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "metas abertas",
                    value: "abertas"
                },
                {
                    name: "sair",
                    value: "sair"
                }
            ]
        })

        // puxar as opções do menu
        switch(opcao) {

            case "cadastra":
                await cadastrarMeta()
                console.log(metas)
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
            case "sair":
                console.log("Até a próxima!")
            return    
        }
    }
}

start()