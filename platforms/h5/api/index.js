import request from './request';
import storage from './storage';
import scrollTo from './scrollTo';
import system from './system';
import navigation from './navigation';
// import network from './network';
import clipboard from './clipboard';
import accelerometer from './accelerometer';

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
// Megalo.use(network);
Megalo.use(clipboard);
Megalo.use(accelerometer);

export default Megalo;