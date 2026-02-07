# YouTube Properties

## Description

This plugin automatically creates an Obsidian note containing metadata of a YouTube video. It fetches title, length, author, channel URL, upload date, thumbnail URL and the video URL.

## How to use

1. Click the ribbon icon (the one with the camera in it)

2. Paste video's URL 

3. Your new note will be created


## How to use settings

### New file location

Set the folder location where your file will be created. Otherwise, files are created in your vault root folder.

## Example template

```
---
title: "Video Title"
length: "10:23"
author: "Channel Name"
channelUrl: "https://www.youtube.com/channel/xxxxx"
uploadDate: "2024-10-01"
thumbnail: "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID"
---
```

## Template variable definitions

- `title` — Video title (string)
- `length` — Human-friendly duration (string)
- `author` — Channel or author name (string)
- `channelUrl` — Channel URL (string, optional)
- `uploadDate` — Upload date reported by the source (string)
- `thumbnail` — Direct URL to the video's thumbnail image (string)
- `videoUrl` — Original YouTube video URL (string)

These map to the plugin's `VideoMetadata` interface.

## License

This project includes a LICENSE file. See [LICENSE](LICENSE) for license terms.

## Contributing

Feel free to contribute.

You can create an issue to report a bug, ask a question, etc.
This is a very simple plugin due to i'm new at TypeScript and Obsidian plugins development. Any recommendation or suggestion of improvement for this plugin would be really appreciated. 

You can make a pull request to contribute to this plugin development.