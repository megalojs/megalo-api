import request from './request';
import storage from './storage';

const Megalo = {
    use(plugin) {
        plugin.install(this);
    }
};

Megalo.use(request);
Megalo.use(storage);

export default Megalo;