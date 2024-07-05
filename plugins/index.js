import { registerFn } from "../common/plugin-element-cache";
import pluginInfo from "../plugin-manifest.json";
import { formFieldConfigHandler } from "./form-field-render";


registerFn(pluginInfo, (handler, client, globals) => {
  handler.on("flotiq.form.field::config", (data) =>
    formFieldConfigHandler(data, pluginInfo)
  );
  
});
