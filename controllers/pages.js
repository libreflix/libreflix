
/* GET Sobre */
exports.sobreController = function(req, res) {
      res.render('sobre', {
        title:'Sobre'
      });
};

/* GET Instalar */
exports.appsController = function(req, res) {
      res.render('apps', {
        title:'Instalar Libreflix'
      });
};


/* GET Uploader */
exports.uploaderController = function(req, res) {
      res.render('uploader', {
        title:'Uploader de Imagem'
      });
};
