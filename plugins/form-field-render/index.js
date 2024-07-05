import {
  addElementToCache,
  getCachedElement
} from "../../common/plugin-element-cache.js";

const BTN_STYLE = `
background: #0083fc;
position: absolute;
top: -2px;
right: 0;
border-radius: 8px;
padding: 5px 10px;
color: white;
font-size: .8em;
`;

const DIVIDER_STYLE = `
background: #dae3f2;
position: absolute;
top: -6px;
height: 1px;
width: 100%;
`;

const regenerate = (formik, contentType) => {

  const alreadyFilled = formik.values['__translations']?.length;
  if(alreadyFilled) {
    alert('Translation field already filled. Delete translation field content and click again');
    return;
  }

  const translatedFields = contentType.metaDefinition.propertiesConfig.__translations.items.order;
  const valuesToCopy = {...formik.values};
  delete valuesToCopy.__translations;
  const valuesToCopyFiltered = {};

  for (const key in valuesToCopy) {
    if (translatedFields.includes(key)) {
      valuesToCopyFiltered[key] = valuesToCopy[key];
    }
  }

  console.log({valuesToCopyFiltered});
  formik.setFieldValue('__translations', [valuesToCopy]);
}

export const formFieldConfigHandler = (flotiqEvent, pluginInfo) => {
  const { name, config, formik, contentType } = flotiqEvent;
  if(name !== '__translations') {
    return null;
  }

  const cacheKey = `${pluginInfo.id}-${contentType.name}-${name}`;
  const cacheEntry = getCachedElement(cacheKey);

  let button;
  let divider;

  if (cacheEntry) {
    cacheEntry.root.formik = formik;
    button = cacheEntry.element[0];
    divider = cacheEntry.element[1];
  } else {
    const cacheData = {
      formik,
      contentType,
    };

    // Create button
    const button = document.createElement("button");
    button.addEventListener("click", () => {
      regenerate(cacheData.formik, cacheData.contentType);
    });
    button.type = "button";
    button.innerText = 'Fill translations with current content';
    button.style = BTN_STYLE;

    // Create divider
    const divider = document.createElement("div");
    divider.style = DIVIDER_STYLE;

    addElementToCache([button, divider], cacheData, cacheKey);
  }

  config.additionalElements = [button, divider];
  return null;
}
