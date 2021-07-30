console.log('hello world');

export default () => {
    return import(/* webpackChunkName: "dynamic-import" */ "./dynamic-import");
}