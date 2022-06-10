import 'mocha/mocha.css';
import mocha from 'mocha/mocha.js';

mocha.setup('bdd');
mocha.checkLeaks();

require('./tests.spec.js');
require('./client.spec.js');

mocha.run();
