# Files Finder
Finder looks recursively for a list of files and/or directories inside a base directory.

```javascript
import Finder = require('finder');
let finder = new Finder('/example/of/base/directory', {
    list: [
        'file.ext',
        'subdir'
    ]
});

yield finder.process();
yield finder.exists(file);
```

The previous example will return a list of File objects.
Once the process method is invoked, use the following attributes to access the list of files found.

 * finder.keys
 * finder.items

## Finder Constructor Parameters
**@base** [string][required] is the base directory where to look for the list of files and directories.
**@specs** [object][optional] the specs object may have the following attributes:

* **specs.list** [array] A list of files and directories to look inside the base directory. If this attribute is not set, then the Finder will look for all the files included in all the sub directories of the base directory.
* **specs.filter** [function] Used to filter the files returned from the list of files and directories.
* **specs.filename** [string] If the specs.filename is specified, only the files with its name will be returned.
* **specs.key** [enum] Look for the Keys enum below.
 
> **Note:** The files processed by the Finder honors the order specified in the specs.list parameter.

## Keys enum
The Keys enum is used to specified how the Finder will process the keys of the collection of files found inside the base directory.

* **File**. If Keys.File is specified in the specs of the Finder constructor, then the finder will process its keys using the full path of the file, including the base directory. 
* **Dirname**. In this case, the keys of the Finder collection will be the full directory path, excluding the file name. 
* **RelativeFile**. The key will be the path of the file, including its file name, but excluding the base directory.
* **RelativeDirname**. The key will be the directory name of the file, excluding its file name and base directory.

## The File object
The File object wraps basic information about the file, as the filename, the dirname and the extension.
The main characteristic of the File object is that it also includes the filename and dirname relative to the base directory specified in the constructor of the Finder.

An example of a File instance returned by the previous example code could be:
Suppose that there is a file called example.ext in the following path /example/of/base/directory/subdir/example.ext

The properties of the file object will be:

* **file.relative.diranme** => 'subdir'
* **file.relative.filename** => 'subdir/example.ext'
* **file.dirname** => '/example/of/base/directory/subdir'
* **file.filename** => '/example/of/base/directory/subdir/example.ext'
* **file.extname** => '.ext'
* **file.basename** => 'example.ext'

## The Wildcard in the list of files and directories
One of the elements of the array specified in the parameter specs.list can take the value "*". The wildcard is a string with only one character, the asterisk.

> **Note:** The wildcard represents "the rest of files". The wildcard also respects the order specified in the specs.list parameter.
