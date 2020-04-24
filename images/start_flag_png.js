/* eslint-disable */
import SimLauncher from '../../joist/js/SimLauncher.js';
const image = new Image();
const unlock = SimLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABSCAYAAAAB6RciAAAACXBIWXMAAC4jAAAuIwF4pT92AAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABVtJREFUeNrs2UlzG0UYxvH/LJZsWZKXhAIOQMGBggtUASc+AsWVG1+AG9dcuXDLhSruJI6zkJ1UkXiR7MROtHpJiNdspSRgOcTL9Iw2WzMc1BMrDqFCyk48qu6LL+1R/ap7nu73Hc3zPFp9HAA+bWVgDVgBfgA+bEWgpUfCnhYOeYAH5IHvgTdbBtj55SfeB+cOem98940XevctH+oBF4Fvgc6g4jTAinz+cez9Yz+iRzqoPShSys8ikjlEIkP98TpAGTgDHJFoN1jAzz6KvfPzAbx6HQCzJ47WHmLjfhEndQNrMI0zNoVbqQIsA78Ch4BM4IBedQM8D3QNvb0dc18cD6jdfog9Po01mKKU/QNcD2AROCpXdiE4wObheWAY6JEG1q1uUJm5gz02hRhIUZm548/MAH1ydZeCA9yG1UwTPRbBiEdxbYfS9CIikcVOZKjdLyLD6RJwGDgP2MEBbv/nNhOjO4beEWbz0RqlyTlEIoOdyLK5YiFxZ4F+iXYDBXyyhXUNLRTC7ImhhdqoyXASySzOlUncchW5bX+VK5sNDvAZrI7eEcbsjeN5UL39AGd8CjGYwsnN+OG0IFe1XwZVQIDPC6feOG6lRmX2LvbYJGIwRWXmrj8zJcPpNPBXcIDbw6nNRI9GMLqi1NdtytcXsZNZRDJHrbAEUJfv6RHgHOAEB/hv4dQVRe/sYHN5pXFzSmQRI3nqK+sAFvCbfF8vBQ6If5joGnq4DaM7htZmUiss4WRuIhJZnLGnwum4vDlNBAf43HDqwvM8qrfu44xPYQ2mKeVmGnMa4dQnt/Gd4AC3v6+Ggd7ZgdEbxy1XG+F0eQJrMEV17p4/86qEngD+Dg5w+8q2mRjRCEZPjPqaoDw5jxjNI4YzbDxY9sPpd7mFz8kCPiDA7SsbCmF0y3AqruDkZhDDaUrXrrNRXPHD6TRwDBgDnOAAm1cV0KMRQu+9jbm/m/LkPMWDfawevdg8swB8bQamNJcXB6OzHaO3C69SxR7JY49N4qRuUL1V8GdeAU4CSWDB3PMoXUdvD2Pu20rX1TNJxMA1SrlZf+a8PDP7gbvNj9h7QK+RDFp7qNFZaDOpFYqsnhxCDGdwxqf9zsKSLLYPAVPPe9yeAm6/4VgDacRIFjuZo74m/PLrtDweBl7kmebrXq5GAd2JEYtQtxxK+TnESBYxlGbj4aPmY6BfNr4q/+cXzNcXFh0Y3dGtFsjoBGI4TWXrIE/J7XdKNrpeapivNixCW2GxUGD1bBIxlKaUnQHXBZhrqhNv78RPm7sdFno4hNFU6a+eSiCG0jhXp/3L9J8y1vt2o9I3dzUsohE2i48RQ2nESB57NM/m4yfl0HkZ7QO7uXl2DKiZxlMFbWlyDjuZxxpOs9HottVpdMX7d7Kg3T2g54Ghy7CI41ZlS+JyHjGYoTL35LxNy5U6CRRfdaaZLxUWHWGMnjgaUFkssHYqgUhkcPKzUHf9uu2IXK1br/MgMl80LLRwU1uwsIQ9mscaSuOMTeOWK8iG0XEZFvm9cnkw/wumhU2MuAyL5ZXGF6fhDCKZo75qAQj5Pvk3iz331cl8BmXojbDoieNaDqWJOcRoHns443e/kGHxi8SV9/J93fTLXj0aweiOUl93qM7fwz58AetSisrsU2HRJ8NiiYAME0BrD1Nft1k7k8S6cJlS9iZeowN9u6nJs0hAh2X0xj1zf7f/2XoZ+An4ghYZVQk7AXwFGLTY8PZSrO/00OXfeqsD9VYHooAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqIAKqICvBGi2OlC0KvCfAQC2TQr5iAXMOgAAAABJRU5ErkJggg==';
export default image;