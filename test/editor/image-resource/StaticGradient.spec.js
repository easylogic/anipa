import { StaticGradient } from "../../../src/editor/image-resource/StaticGradient";

beforeEach(() => {

})

afterEach( () => {

})

test('StaticGradient - new StaticGradient', () => {
    var gradient = new StaticGradient();

    expect(gradient.itemType).toEqual('image-resource');
    expect(gradient.type).toEqual('static-gradient');
    expect(gradient+"").toEqual('linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))')

    gradient.color = 'red'
    expect(gradient+"").toEqual('linear-gradient(to right, red, red)')
});
