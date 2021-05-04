import React from 'react';
import Info from './info';

const componentDidMountSpy = jest.spyOn(Info.prototype, 'componentDidMount');
const componentDidUpdateSpy = jest.spyOn(Info.prototype, 'componentDidUpdate');
const componentWillUnmountSpy = jest.spyOn(Info.prototype, 'componentWillUnmount');

const setUp = () => shallow(<Info />);

describe('Info component', () => {
  let component;
  beforeEach(() => {
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'removeEventListener');
    component = setUp();
  });

  afterEach(() => {
    window.addEventListener.mockRestore();
    window.removeEventListener.mockRestore();
  });

  it('should render Info component', () => {
    expect(component).toMatchSnapshot();
  });

  describe('Lifecycle methods', () => {
    // componentDidMount должен быть вызван 1 раз
    it('should call componentDidMount once', () => {
      expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
    });

    // Когда произошло монтирование компонента, то не должно произойти размонтирование
    it('should not call componentWillUnmount when component just mounted', () => {
      expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
      expect(componentWillUnmountSpy).toHaveBeenCalledTimes(0);
    });

    /**
     * Проверка - действительно ли происходит обновление компонента
     * при получение например, новых пропсов
     */
    it('should call componentDidUpdate', () => {
      component.setProps();
      expect(componentDidUpdateSpy).toHaveBeenCalled();
    });

    // При размонитровании компонениа вызывается соответствующий метод
    it('should call componentWillUnmount', () => {
      component.unmount();
      expect(componentWillUnmountSpy).toHaveBeenCalledTimes(1);
    });
  });

  // Вешается ли обработчик 'resize' при монтаже компонента
  describe('Component handlers', () => {
    it('should call addEventListener when component mounted', () => {
      expect(window.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('should call handleChangeTitle in componentDidUpdate', () => {
      const instance = setUp().instance();
      instance.handleChangeTitle = jest.fn();
      instance.componentDidUpdate();
      expect(instance.handleChangeTitle).toHaveBeenCalled();
    });

    it('should call removeEventListener when component unmounted', () => {
      component.unmount();
      expect(window.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('should call handleWidth during window resize', () => {
      expect(component.state().width).toBe(0);
      global.dispatchEvent(new Event('resize'));
      expect(component.state().width).toBe(window.innerWidth);
    });
  });
});
