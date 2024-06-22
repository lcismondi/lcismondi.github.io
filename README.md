# Versiones

### V4:
- Template: https://docs.github.com/es/pages
- Blog: https://cybor-soratemplates.blogspot.com/

### V3:
- Template: https://cybor-soratemplates.blogspot.com/
  
### V2:
- Template: https://www.templateclue.com/ideal-blogger-template/

### V1:
- Template: https://btemplates.com/2013/blogger-template-metrominimalist/


# Performance
El control de renderizado lo hago con: [Page Speed](https://pagespeed.web.dev/)


# Desarrollo local
La web la pruebo en un servidor local:

```
H:
cd path/to/your/project    //Ir hasta el proyecto
python3 -m http.server     //Inicia el servidor
http://localhost:8000      //Abrir desde el navegador
Ctrl + Shift + R           //Actualizar cache
Ctrl + C                   //Cerrar servidor
```

# GIT
Para sincronizar el repositorio remoto:
```
git init
git status
git add .      //Agrega los archivos nuevos y modificados al área de "preparación" (staged)
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
git commit -m "Comentario"      //Crea una nueva versión en el ambiente local
git branch -M main              //Renombra la rama (forzado)
//Agrega la URL remota con el nombre "origin" al repositorio local
git remote add origin https://github.com/lcismondi/lcismondi.github.io
git remote -v                   //Verifica configuración del remoto
//Cambia la URL del remoto
git remote set-url origin https://github.com/tu-usuario/nueva-url-repositorio.git
//Envía los commits de la rama "main" al repositorio remoto "origin".
//La opción -u establece "origin"" como la referencia predeterminada para futuros push y pull de la rama "main".
git push -u origin main
```
