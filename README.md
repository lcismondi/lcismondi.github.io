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

# Desarrollo local
La web la pruebo en un servidor local:

```
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
git add .
git commit -m "Comentario"
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
git commit -m "Comentariot"
git branch -M main
git remote add origin https://github.com/lcismondi/lcismondi.github.io
git push -u origin main

