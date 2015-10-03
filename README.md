### Juego de 3 en ralla con inteligencia artificial
- Control de Turno y Movimientos

- Reconocimiento de Victoria

- Reconocimiento de Movimiento Bloqueado

- Inteligencia Artificial en Movimiento de la Maquina

- Mensaje de Fin de Partida y Reinicio

- Boton Dinamico de Twitter

- Maquillaje del Juego


### Deploy juego
- :fork_and_knife: Forkeame en Github :smile:
- clone or download repository
- console deploy
```bash
$bower install
$grunt default
```


### Control del Juego
###### Status Game
- empty = 0
- circle = machine = 1
- cross = human = 2


###### Status Matrix
```markdown
/************************************
*			*			*			*
*			*			*			*
*	 c02	*	 c12	*	 c22	*
*			*			*			*
*			*			*			*
*************************************
*			*			*			*
*			*			*			*
*	 c01	*	 c11	*	 c21	*
*			*			*			*
*			*			*			*
*************************************
*			*			*			*
*			*			*			*
*	 c00	*	 c10	*	 c20	*
*			*			*			*
*			*			*			*
************************************/
```
