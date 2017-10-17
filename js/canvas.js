// --------------------- Snake game -----------------

window.onload = function() {
    var canvas = document.getElementById('mon_canvas')
        if (!canvas) {
            alert("Impossible de récupérer le canvas")

            return
        }

    var context = canvas.getContext('2d')
        if (!context) {
            alert("Impossible de récupérer le context du canvas")

            return
        }


///////////////////////// setup des fonctions et initialisations des variables ////////////////////////////////
    
    let isGrid = Number(prompt("Voulez-vous jouer avec la grille ?\n\nJouer sans: entrez 0\nJouer avec: entrez 1"))
    if (isGrid !== 0 && isGrid !== 1) {
        isGrid = 0
    }

    let grid = 20


    //initialisation position et vitesse tête
    let posX = canvas.width / 2
    let posY = canvas.width / 2

    let vitesseX = 0
    let vitesseY = -1

    let head = [posX, posY]


    //initialisation de la queue
    let bodyInit = []

    let queue = Number(prompt("Plutôt petite ou grosse ?\n\nMerci d'entrer la longueur de queue désirée.")) + 4

    if (!queue) {
        bodyInit = [[posX, posY + grid], [posX, posY + (grid * 2)], [posX, posY + (grid * 3)]]
    } else {
        for (i = 1; i < queue; i++) {
            bodyInit.push([posX, posY + i * grid])
        }
    }

    let body = bodyInit



    //initialisation du fruit
    let posFruitX = Math.floor(Math.random() * grid) * grid
    let posFruitY = Math.floor(Math.random() * grid) * grid

    let fruitRadius = 7

    let fruitType = 0


    //initialisation du score
    let score = body.length - 3



    function draw() {
        //affichage du grid
        if (isGrid === 1) {
            for (i = 0; i < grid + 10; i++) {
                for (j = 0; j < grid + 10; j++) {
                    context.strokeStyle = "white"
                    context.strokeRect(i * grid, j * grid, grid, grid)
                }
            }
        }

        //affichage tête
        context.fillStyle = "green"
        context.fillRect(head[0], head[1], grid, grid)

        //affichage body
        for (i = body.length - 1; i > 0; i--) {
            context.fillStyle = "#3d9662"
            context.fillRect(body[i][0], body[i][1], grid, grid)
        }

        //affichage des différents fruits
        context.beginPath()
        if (fruitType === 9) {
            context.fillStyle="yellow"
        } else if (fruitType === 7 || fruitType === 8) {
            context.fillStyle="blue"
        } else {
            context.fillStyle="red"
        }
        context.arc(posFruitX + grid / 2, posFruitY + grid / 2, fruitRadius, 0, Math.PI * 2)
        context.fill()
        context.closePath()

        //affichage du score
        context.fillStyle="orange"
        context.font = "30px Helvetica"
        context.fillText(score, (canvas.width / 2) - (grid - 2), 30)
    }

    let speed
    let difficulte = Number(prompt("Choisissez le niveau de difficulté :\n\n0 : SLOW\n1 : NORMAL\n2 : FAST"))

    if (difficulte === 0) {
        speed = 10
    }
    if (difficulte === 1) {
        speed = 20
    }
    if (difficulte === 2) {
        speed = 30
    }
    if (difficulte !== 0 && difficulte !== 1 && difficulte !== 2) {
        speed = 20
    }

    var myInterval = setInterval(anime, 1000/speed)




/////////////////////////////////// fonctions anime /////////////////////////////////////////////////

    function anime() {
        context.clearRect(0, 0, canvas.width, canvas.height)

        draw()

        head = [posX, posY]

// ---------------- gestion des commandes (bas, haut, droite, gauche) ------------

        document.addEventListener('keydown', function (e){
            if (e.keyCode === 40) {
                vitesseY = 1
                vitesseX = 0
            }
            if (e.keyCode === 38) {
                vitesseY = -1
                vitesseX = 0
            }            

            if (e.keyCode === 39) {
                vitesseX = 1
                vitesseY = 0
            }
            if (e.keyCode === 37) {
                vitesseX = -1
                vitesseY = 0
            }
            if (e.keyCode === 65) {
                for (i = 0; i < 1; i++) {
                    body.push([])
                    score++
                }
            }
        })

// ---------------- gestion du dépassement de la limite du canvas ------------

        if (posX > canvas.width) {
            posX = 0
        }
        if (posX < 0) {
            posX = canvas.width
        }
        if (posY > canvas.height) {
            posY = 0
        }
        if (posY < 0) {
            posY = canvas.height
        }

// ---------------- gestion du game over (si le snake se bouffe la queue) ------------


        let taille = body.length

        for (i = 1; i < body.length - 1; i++) {
            if (head[0] === body[i][0] && head[1] === body[i][1] && body.length > 3) {
                alert("GAME OVER\n\nSCORE: " + score)
                score = 0
                for (i = 2; i < taille - 1; i++) {
                    body.pop()
                }
            }
        }

// ---------------- gestion de la queue (pour qu'elle suive la tête en se "pliant" ------------


        for (i = body.length - 1; i > 0; i--) {
            body[i][0] = body[i - 1][0]
            body[i][1] = body[i - 1][1]
        }

        body[0][0] = head[0]
        body[0][1] = head[1]

// ---------------- gestion de la digestion du fruit (queue++) ------------


        if (head[0] === posFruitX && head[1] === posFruitY) {
            if (fruitType === 9) {
                for (i = 0; i < 10; i++) {
                    body.push([])
                    score++
                }
            } else if (fruitType === 7 || fruitType === 8) {
                for (i = 0; i < 5; i++) {
                    body.push([])
                    score++
                }
            } else {
                body.push([])
                score++
            }

            posFruitX = Math.floor(Math.random() * grid) * grid
            posFruitY = Math.floor(Math.random() * grid) * grid

            //pour éviter qu'un fruit n'apparaisse sous le body (marche pas pour l'instant)
            for (i = 0; i < body.length - 1; i++) {
                if (body[i][0] === posFruitX && body[i][1] === posFruitY) {
                    posFruitX = Math.floor(Math.random() * grid) * grid
                    posFruitY = Math.floor(Math.random() * grid) * grid
                    i = 0
                }
            }

            fruitType = Math.floor(Math.random() * 10)
        }


// ---------------- gestion des vitesses -------------------------

        posX += (vitesseX * grid)
        posY += (vitesseY * grid)
    }
}