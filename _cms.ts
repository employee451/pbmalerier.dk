import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

cms.storage("src");

const background_color = {
  name: "background_color",
  type: "color",
  label: "Baggrundsfarve",
  value: "#1fbfaf"
};

cms.document({
  name: "index-page",
  store: "src:index.vto",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titel"
    },
    {
      name: "description",
      type: "markdown",
      label: "Beskrivelse",
      upload: false,
    },
    background_color,
  ]
});

cms.collection({
  name: "billeder",
  label: "Malerier",
  icon: "image",
  store: "src:billeder/*.md",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titel"
    },
    {
      name: "painting",
      type: "file",
      label: "Maleri",
      upload: "paintings"
    },
    {
      name: "content",
      type: "markdown",
      label: "Beskrivelse",
      upload: false,
    },
    background_color,
  ],
  documentName: "{title}.md"
});

cms.collection({
  name: "kategorier",
  label: "Kategorier",
  icon: "folders",
  store: "src:kategorier/*.md",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titel"
    },
    {
      name: "paintings",
      type: "relation-list",
      label: "Malerier",
      collection: "billeder"
    },
    {
      name: "content",
      type: "markdown",
      label: "Beskrivelse",
      upload: false,
    },
    background_color,
  ],
  documentName: "{title}.md"
});

cms.upload({
  name: "paintings",
  label: "Maleri-uploads",
  icon: "images",
  description: "Her er dine maleri uploads",
  store: "src:paintings",
  listed: false,
});

export default cms;