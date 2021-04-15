import SomeDependency from './dependency/some-dependency';

export default (content: string) => {
    const logger = new SomeDependency();
    logger.log(content);
    
    return `something: ${content}`;
};