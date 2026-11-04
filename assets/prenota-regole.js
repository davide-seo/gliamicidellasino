/* Regole della richiesta di prenotazione · Gli Amici dell'Asino.
   Ogni vincolo viene dalle pagine delle attività: età minima, peso in sella, durata, stagione. */
(function () {
  var D = window.PRENOTA_DATI; // proposte con titolo, url, img; base del sito
  var P = function (id, o) { var x = D.proposte[id] || {}; return Object.assign({ id: id, titolo: x.titolo, url: x.url, img: x.img }, o); };
  var ETA = { sotto2: 1, '2-4': 3, '5-10': 7, '11-14': 12 };
  var inStagioneCastagne = function (d) { var m = d.getMonth() + 1, g = d.getDate(); return (m === 10 && g >= 17) || (m === 11 && g <= 15); };

  window.PRENOTA = {
    sito: 'asino',
    destinatario: 'amicidellasino@gmail.com',
    gestisci: D.gestisci,
    home: D.home,
    ritrovo: 'Ritrovo alle ore __ in asineria, Loc. Campolombardo 37, Sassi Bianchi, Pratovecchio Stia (cercate «Gli Amici dell\'Asino» su Google Maps).',
    chiavi: { nome: 'nome', email: 'email', telefono: 'telefono', data: 'data' },
    testi: {
      proposte: 'Le attività adatte a voi',
      nessuna: 'Con queste risposte non c\'è un\'attività giusta. Scriveteci lo stesso: le attività si adattano anche su richiesta, per durata e tipo.',
      nota: 'Questa è una <strong>richiesta</strong>, non ancora una prenotazione: vale quando Marta o Fabio vi rispondono confermando data e orario. Le attività sono riservate ai soci; la tessera si fa alla prima attività. Il modulo usa il servizio FormSubmit per recapitare la mail. <a href="' + D.privacy + '">Privacy</a>.',
      fattoTitolo: 'Abbiamo ricevuto la vostra richiesta',
      fatto: function (p, F, data) { return 'La richiesta per <strong>' + p.titolo + '</strong>' + (data ? ' il ' + data : '') + ' è arrivata a Marta e Fabio. Non è ancora confermata: vi rispondono a ' + F.email + ' con data e orario. Se è urgente, un messaggio WhatsApp al 320 067 6766.'; },
    },
    gruppi: [
      { id: 'chi', titolo: 'Chi viene', breve: 'Chi viene', obbligatorio: true, opzioni: [
        { id: 'famiglia', nome: 'Famiglia con bambini', nota: 'I bimbi in sella, i grandi a piedi' },
        { id: 'adulti', nome: 'Solo adulti', nota: 'Coppie, amici, gruppi di grandi' },
        { id: 'gruppo', nome: 'Scuola o gruppo organizzato', nota: 'Classi, centri estivi, associazioni' },
        { id: 'cerimonia', nome: 'Matrimonio o cerimonia', nota: 'Gli asini vengono da voi' },
        { id: 'regalo', nome: 'È un regalo', nota: 'Per un compleanno, un anniversario' },
      ] },
      { id: 'eta', titolo: 'Età del bambino più piccolo', breve: 'Bimbo più piccolo', obbligatorio: true, se: function (S) { return S.chi === 'famiglia'; }, opzioni: [
        { id: 'sotto2', nome: 'Meno di 2 anni', nota: 'In sella non si sale ancora' },
        { id: '2-4', nome: 'Da 2 a 4 anni', nota: 'Meglio un\'ora, non di più' },
        { id: '5-10', nome: 'Da 5 a 10 anni', nota: 'Tutte le attività' },
        { id: '11-14', nome: 'Da 11 a 14 anni', nota: 'In sella fino a 40 kg' },
      ] },
      { id: 'tempo', titolo: 'Quanto tempo avete', breve: 'Tempo', obbligatorio: true, se: function (S) { return S.chi !== 'cerimonia'; }, opzioni: [
        { id: 'ora', nome: 'Un\'ora o due', nota: 'Una passeggiata breve' },
        { id: 'mezza', nome: 'Mezza giornata', nota: 'Fino a 3 ore e mezza' },
        { id: 'giornata', nome: 'Una giornata', nota: 'Con il pranzo al sacco' },
        { id: 'giorni', nome: 'Più giorni', nota: 'Anche dormendo nel bosco' },
      ] },
      { id: 'voglia', titolo: 'Cosa vi piacerebbe', breve: 'Interessi', multi: true, se: function (S) { return S.chi && S.chi !== 'cerimonia' && S.chi !== 'gruppo'; }, opzioni: [
        { id: 'conoscere', nome: 'Conoscere l\'asino da vicino', nota: 'Spazzolarlo, dargli da mangiare' },
        { id: 'camminare', nome: 'Camminare con gli asini', nota: 'Nei prati e nei boschi' },
        { id: 'natura', nome: 'Tracce e animali del bosco', nota: 'Impronte, tane, segni' },
        { id: 'storia', nome: 'Castelli e storia', nota: 'Porciano, Romena, Dante' },
        { id: 'castagne', nome: 'Castagne e autunno', nota: 'Raccolta nel castagneto' },
      ] },
    ],
    preimposta: function (S, id) {
      if (id === 'scuole') S.chi = 'gruppo';
      else if (id === 'cerimonie') S.chi = 'cerimonia';
      else if (id === 'regalo') S.chi = 'regalo';
      else { S.chi = id === 'trekking' ? 'adulti' : 'famiglia'; if (S.chi === 'famiglia') S.eta = '5-10'; S.tempo = { ciao: 'mezza', ritmo: 'ora', sherlock: 'mezza', orme: 'mezza', trekking: 'giornata', castagne: 'mezza', terrazza: 'giorni' }[id] || 'mezza'; }
    },
    proposte: [
      P('ciao', { etichette: ['2-14 anni con i genitori', '2-2,5 ore'], eta: [2, 14], ore: 2.5, tipi: ['conoscere'], per: ['famiglia'] }),
      P('ritmo', { etichette: ['In sella dai 2 anni', '1 o 2 ore'], eta: [2, 99], ore: 1, tipi: ['camminare', 'conoscere'], per: ['famiglia', 'adulti'] }),
      P('sherlock', { etichette: ['Dai 5 anni', '2,5 ore'], eta: [5, 99], ore: 2.5, tipi: ['natura', 'camminare'], per: ['famiglia'] }),
      P('orme', { etichette: ['Bimbi dai 5 anni e adulti', '3-3,5 ore'], eta: [5, 99], ore: 3.5, tipi: ['storia', 'camminare'], per: ['famiglia', 'adulti'] }),
      P('trekking', { etichette: ['Bambini, ragazzi, adulti', 'Da poche ore a più giorni'], eta: [2, 99], ore: 0, tipi: ['camminare', 'storia', 'natura'], per: ['famiglia', 'adulti', 'gruppo', 'regalo'] }),
      P('castagne', { etichette: ['Per tutti', 'Ore 10-12:30'], eta: [0, 99], ore: 2.5, tipi: ['castagne', 'camminare'], per: ['famiglia', 'adulti'] }),
      P('terrazza', { etichette: ['Per i soci', 'Una notte in tenda'], eta: [0, 99], ore: 24, tipi: ['natura'], per: ['famiglia', 'adulti', 'regalo'] }),
      P('scuole', { etichette: ['Scuole di ogni ordine', 'Catalogo su richiesta'], per: ['gruppo'] }),
      P('cerimonie', { etichette: ['Foto, brindisi, battesimo della sella'], per: ['cerimonia'] }),
      P('regalo', { etichette: ['Su misura', 'Anche self guided, 10 km'], per: ['regalo'] }),
    ],
    valuta: function (S, p, oggi) {
      var perche = [], contro = [], punti = 0;
      if (p.per.indexOf(S.chi) < 0) {
        contro.push({ scuole: 'è pensata per classi e gruppi organizzati', cerimonie: 'è il servizio per matrimoni e cerimonie', regalo: 'è la formula per fare un regalo', ciao: 'è un\'attività per bambini con i genitori', sherlock: 'è un\'attività per bambini' }[p.id] || 'non è pensata per chi avete indicato');
        return { perche: perche, contro: contro };
      }
      if (S.chi === 'gruppo') { perche.push(p.id === 'scuole' ? 'percorsi didattici all\'aperto, in asineria o in trasferta da voi' : 'si organizza per gruppi di durata e difficoltà variabili'); return { perche: perche, punti: p.id === 'scuole' ? 50 : 10 }; }
      if (S.chi === 'cerimonia') { perche.push('bardatura, operatore specializzato e trasporto in loco compresi'); return { perche: perche, punti: 50 }; }
      if (S.chi === 'regalo') { perche.push({ regalo: 'la proposta si costruisce con voi, anche di più giorni', trekking: 'un trekking con l\'asino è un regalo che si ricorda', terrazza: 'una notte in tenda fra le fronde, nel bosco' }[p.id]); punti += p.id === 'regalo' ? 30 : 10; }
      if (S.chi === 'famiglia' && S.eta) {
        var e = ETA[S.eta];
        if (p.eta && e < p.eta[0] && p.eta[0] >= 5) contro.push('serve che il più piccolo abbia almeno ' + p.eta[0] + ' anni');
        if (S.eta === 'sotto2' && p.id !== 'castagne' && p.id !== 'terrazza') perche.push('in sella si sale dai 2 anni: il più piccolo cammina con voi');
        if (S.eta === '2-4' && p.id === 'ritmo') { perche.push('c\'è la versione da un\'ora, pensata per i bimbi fino a 4 anni'); punti += 15; }
        if (S.eta === '11-14' && p.id === 'ciao') contro.push('è pensata soprattutto per i più piccoli');
        if (p.eta && e >= p.eta[0] && p.id !== 'castagne') perche.push('adatta all\'età dei vostri bambini');
      }
      if (S.chi === 'adulti' && (p.id === 'orme' || p.id === 'trekking')) perche.push('va bene anche per soli adulti');
      if (S.tempo === 'ora' && p.ore > 3) contro.push('dura più di quanto avete');
      if (S.tempo === 'ora' && p.ore && p.ore <= 2) punti += 10;
      if (S.tempo === 'giorni' && (p.id === 'trekking' || p.id === 'terrazza')) { perche.push(p.id === 'trekking' ? 'si fa anche di più giorni, con l\'asino che porta lo zaino' : 'si dorme in tenda su una terrazza fra gli alberi'); punti += 25; }
      if (S.tempo !== 'giorni' && p.id === 'terrazza') contro.push('è una notte in tenda: serve più di un giorno');
      if ((S.tempo === 'giornata' || S.tempo === 'mezza') && p.ore >= 2.5 && p.ore <= 4) punti += 8;
      if (p.id === 'castagne') {
        if (inStagioneCastagne(oggi)) { perche.push('è la stagione: si fa fino al 15 novembre'); punti += 15; }
        else perche.push('fuori dal periodo 17 ottobre-15 novembre si fa su richiesta');
        perche.push('le castagne raccolte si portano a casa tutte');
      }
      var match = (S.voglia || []).filter(function (v) { return (p.tipi || []).indexOf(v) > -1; }).length;
      punti += match * 12;
      if (match && p.id === 'sherlock') perche.push('si cercano impronte e tane degli animali del Parco');
      if (match && p.id === 'orme') perche.push('trekking someggiato fino a un castello della valle');
      if (p.id === 'ritmo' || p.id === 'castagne') perche.push('alla fine i bimbi ricevono la patente di conduttore d\'asino');
      if (p.id === 'ciao') perche.push('si spazzola l\'asino, gli si prepara la pappa, si sale in groppa');
      return { perche: perche, contro: contro, punti: punti };
    },
    campi: [
      { id: 'data', label: 'Giorno che preferite', breve: 'Giorno', tipo: 'date', req: true, min: 'oggi', se: function (S) { return S.chi !== 'gruppo'; } },
      { id: 'data2', label: 'In alternativa', breve: 'Alternativa', tipo: 'date', min: 'oggi', se: function (S) { return S.chi !== 'gruppo'; } },
      { id: 'periodo', label: 'Periodo o anno scolastico', breve: 'Periodo', se: function (S) { return S.chi === 'gruppo'; }, req: true },
      { id: 'momento', label: 'Momento della giornata', breve: 'Momento', tipo: 'select', opzioni: ['Indifferente', 'Mattina', 'Pomeriggio'], se: function (S, p) { return S.chi !== 'cerimonia' && p.id !== 'terrazza'; } },
      { id: 'adulti', label: 'Adulti', tipo: 'number', min: 0, max: 60, def: '2', req: true, se: function (S) { return S.chi !== 'gruppo'; } },
      { id: 'bambini', label: 'Bambini', tipo: 'number', min: 0, max: 60, def: function (S) { return S.chi === 'famiglia' ? '1' : '0'; }, se: function (S) { return S.chi !== 'gruppo'; } },
      { id: 'partecipanti', label: 'Quanti siete in tutto', breve: 'Partecipanti', tipo: 'number', min: 1, req: true, se: function (S) { return S.chi === 'gruppo'; } },
      { id: 'scuola', label: 'Scuola o gruppo, e classe', breve: 'Scuola o gruppo', se: function (S) { return S.chi === 'gruppo'; }, req: true },
      { id: 'asini', label: 'Quanti asini vi servono', breve: 'Asini', tipo: 'number', min: 1, max: 6, def: function (S) { return S.chi === 'famiglia' ? '1' : '2'; }, nota: 'Gli asini sono sei. Per i bambini ne consigliamo uno a testa.', se: function (S, p) { return ['ciao', 'ritmo', 'sherlock', 'orme', 'trekking', 'castagne'].indexOf(p.id) > -1; } },
      { id: 'nomibimbi', label: 'Nomi dei bambini', breve: 'Nomi dei bambini', nota: 'Solo il nome, serve per l\'attestato personalizzato.', se: function (S, p, F) { return +F.bambini > 0; }, largo: true },
      { id: 'casco', label: 'Casco per i bambini', breve: 'Casco', tipo: 'select', opzioni: ['Lo portiamo noi (va bene da bici)', 'Da noleggiare in asineria'], se: function (S, p, F) { return +F.bambini > 0 && p.id !== 'terrazza'; } },
      { id: 'socio', label: 'Siete già soci', breve: 'Soci', tipo: 'select', opzioni: ['No, è la prima volta', 'Sì, abbiamo la tessera'] },
      { id: 'nome', label: 'Nome e cognome di chi prenota', breve: 'Nome', req: true, auto: 'name' },
      { id: 'email', label: 'Email', tipo: 'email', req: true, auto: 'email' },
      { id: 'telefono', label: 'Telefono', breve: 'Telefono', tipo: 'tel', req: true, auto: 'tel', nota: 'Per avvisarvi se il meteo cambia i programmi.' },
      { id: 'note', label: 'Note, richieste, domande', breve: 'Note', tipo: 'textarea', largo: true },
      { id: 'privacy', label: 'Ho letto l\'<a href="' + D.privacy + '" target="_blank">informativa privacy</a> e acconsento a essere ricontattato per questa richiesta.', tipo: 'check', req: true },
    ],
    oggetto: function (S, p, F) {
      var chi = S.chi === 'gruppo' ? (F.partecipanti + ' persone') : ((+F.adulti || 0) + ' adulti' + (+F.bambini ? ' + ' + F.bambini + ' bambini' : ''));
      var d = F.data ? new Date(F.data + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }) : (F.periodo || '');
      return 'Richiesta di prenotazione: ' + p.titolo + ' · ' + d + ' · ' + chi;
    },
    autorisposta: function (p, F, data) {
      return 'Ciao ' + (F.nome || '') + ', abbiamo ricevuto la richiesta per ' + p.titolo + (data ? ' il ' + data : '') + '. Non è ancora una prenotazione: ti rispondiamo noi per confermare data e orario, di solito entro un giorno. Se è urgente scrivici su WhatsApp al 320 067 6766. Gli Amici dell\'Asino';
    },
    risposte: {
      conferma: function (d, x) {
        return { oggetto: 'Prenotazione confermata: ' + d.p, testo: 'Ciao ' + (d.n || '') + ',\n\nconfermiamo la vostra prenotazione per ' + d.p + (x.data ? ' ' + x.data : (d.d ? ' ' + new Date(d.d + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : '')) + '.\n\n' + x.orario + '\n\nPortate abbigliamento comodo e scarpe robuste, e il casco dei bimbi se ce l\'avete (va bene quello da bici).\nCome arrivare: https://maps.app.goo.gl/7whjPVpAEtRJnqDa7\n\nPer qualsiasi cosa scriveteci su WhatsApp al 320 067 6766.\n\nA presto,\nGli Amici dell\'Asino' };
      },
      altra: function (d, x) {
        return { oggetto: 'La vostra richiesta: ' + d.p, testo: 'Ciao ' + (d.n || '') + ',\n\ngrazie per la richiesta per ' + d.p + '. Nel giorno che avete indicato gli asini sono già impegnati: possiamo proporvi ' + (x.data || '[nuova data]') + '.\n\n' + x.orario + '\n\nFateci sapere se va bene e la confermiamo.\n\nGli Amici dell\'Asino' };
      },
      no: function (d) {
        return { oggetto: 'La vostra richiesta: ' + d.p, testo: 'Ciao ' + (d.n || '') + ',\n\ngrazie per averci scritto. Purtroppo questa volta non riusciamo a organizzare ' + d.p + ' nella data richiesta. Se volete, scriveteci un\'altra data e vediamo insieme.\n\nUn saluto,\nGli Amici dell\'Asino' };
      },
    },
  };
})();
