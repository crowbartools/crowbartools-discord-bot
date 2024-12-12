import { getBaseEmbed } from "../info-slash";

export const tuts =
{
    name: 'Guides and Tutorials',
    message: {
        content: "Guides and Tutorials by the community",
        embeds: [
            getBaseEmbed().setTitle('Guides and Tutorials').setDescription(`
Hi, here you can see a short list of guides and tutorials made by the community for Firebot:

A YouTube Firebot tutorial playlist by heyaapl:
https://www.youtube.com/playlist?list=PL4AUBPu8fw6jfzEvd-GYw357uSNJBt53E

A written guide by Tío on Google Drive:
https://drive.google.com/drive/folders/1jQzl-kfIdeMTlo6yC7gUxWtyBtSDKYpI

If you have made one or know of anyone else that have made something like this for Firebot please tell us so that we can add it to this list and to our Getting Started page over of the Firebot Github Wiki:
https://github.com/crowbartools/Firebot/wiki/Getting-Started
`),
        ],
    },
}