export const formatFilename = (filename, folder) => {
    const cleanFilename = filename.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, "-")
    return `${folder}/${cleanFilename}`
}
