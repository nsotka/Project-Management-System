import React from 'react';
import Requests from '../common/requests';
import ProjectStore from './ProjectStore';
import UiStore from './UiStore';

class RootStore {
  constructor() {
    this.requests = new Requests(this);
    this.uiStore = new UiStore(this);
    this.projectStore = new ProjectStore(this);
  }
}

export const StoresContext = React.createContext(new RootStore());

export const useStores = () => React.useContext(StoresContext);