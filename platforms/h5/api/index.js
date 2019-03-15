import request from './request';
import storage from './storage';
import scrollTo from './scrollTo';
import system from './system';
import navigation from './navigation';

const Megalo = {
    use(plugin) {
        plugin.install(this);
    }
};

Megalo.use(request);
Megalo.use(storage);
Megalo.use(scrollTo);
Megalo.use(system);
Megalo.use(navigation);

export default Megalo;