
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

/* GET Privacidade */
exports.privacidadeController = function(req, res) {
      res.render('privacidade', {
        title:'Uploader de Imagem'
      });
};

/* GET Regras */
exports.regrasdeController = function(req, res) {
      res.render('regras', {
        title:'Uploader de Imagem'
      });
};

/* GET FAQ */
exports.faqController = function(req, res) {
      res.render('faq', {
        title:'Uploader de Imagem'
      });
};

/* GET FAQ */
exports.dmcaController = function(req, res) {
      res.render('dmca', {
        title:'Uploader de Imagem'
      });
};
