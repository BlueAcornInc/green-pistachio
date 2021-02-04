import webpack from "webpack";
import { Configuration } from "webpack";

export default class GetCompiler {
    public execute(config: Configuration) {
        return webpack(config);
    }
}