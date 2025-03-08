# Mock Article

Lorem [ipsum dolor sit amet](http://example.com), consectetur adipiscing elit. Donec maximus ornare arcu in mattis. Donec egestas tortor id rhoncus consequat. `Vivamus` condimentum ex `non` suscipit rutrum. Nullam suscipit, sapien at malesuada sollicitudin, arcu sem tempus odio, `quis` pulvinar2 tortor turpis non nibh. Nulla accumsan. **Bold bold bold**. *Italic italic italic*. Underline underline underline. ***Bold+italic***. **Bold+underline**. ***Bold+Italic+Underline***. *Italic+underline*. ~~Strikethrough~~.

## Heading 2: a

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus ornare arcu in mattis. Donec egestas tortor id rhoncus consequat. Vivamus condimentum ex non suscipit rutrum. Nullam suscipit, sapien at malesuada sollicitudin, arcu sem tempus odio, quis pulvinar tortor turpis non nibh. Nulla accumsan vulputate pellentesque. Vestibulum nisi magna, accumsan eu erat sed, pretium feugiat risus. 

## Heading 2: b

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus ornare arcu in mattis. Donec egestas tortor id rhoncus consequat. Vivamus condimentum ex non suscipit rutrum. Nullam suscipit, sapien at malesuada sollicitudin, arcu sem tempus odio, quis pulvinar tortor turpis non nibh. Nulla accumsan vulputate pellentesque.

- bullet 1
- bullet 2
- bullet 3

Vivamus condimentum ex non suscipit rutrum. Nullam suscipit, sapien at malesuada sollicitudin, arcu sem tempus odio, quis pulvinar tortor turpis non nibh. Nulla accumsan vulputate pellentesque:

1. list 1
2. list 2
3. list 3

Vivamus condimentum ex non suscipit rutrum. Nullam suscipit, sapien at malesuada sollicitudin, arcu sem tempus odio, quis pulvinar tortor turpis non nibh. Nulla accumsan vulputate pellentesque:

- bullet 1
    - subbullet 1
    - subbullet 2
- bullet 2
    - subbullet 1

Vivamus condimentum ex non suscipit rutrum. Nullam suscipit, sapien at malesuada sollicitudin, arcu sem tempus odio, quis pulvinar tortor turpis non nibh. Nulla accumsan vulputate pellentesque:

1. list 1
    1. asd
2. list 2
    1. zxc
    2. qwe

### Heading 3

Nulla accumsan vulputate pellentesque. Vestibulum nisi magna, accumsan eu erat sed, pretium feugiat risus. Vestibulum quis lectus massa. Sed in ultrices turpis. Etiam mollis pretium purus, in tincidunt velit convallis ut. In ac mi in tortor varius facilisis. Aliquam consequat lacus sed tortor convallis lacinia. Etiam feugiat molestie ligula, id tincidunt ante aliquet nec. Integer tincidunt imperdiet aliquam. Pellentesque placerat sagittis ante nec placerat. Ut risus sem, ornare at urna sed, dictum faucibus velit.

```python
from z3 import *

output = "qhcpgbpuwbaggepulhstxbwowawfgrkzjstccbnbshekpgllze"
userInput = [BitVec(f'userInput_{i}',8) for i in range(50)]
print("userInput=",userInput)

def getIndex(g):
    return int(FuncDeclRef.name(g).replace('userInput_',''))

s=Solver()
# ensure the results are ASCII characters
for v in userInput:
    s.add(v>32)
    s.add(v<127)

print(s)

# implement the loop in Ghidra
for i in range(3):
    for j in range(50):
        step1 = (j % 255 >> 1 & 85) + (j % 255 & 85)
        step2 = (step1 >> 2 & 51) + (step1 & 51)
        step3 = (step2 >> 4) + userInput[j] + -97 + (step2 & 15)
        userInput[j] = step3 + step3 / 26 * -26 + ord('a')

# make sure the encrypted value equals the memcmp value
for j in range(50):
    s.add(userInput[j]==ord(output[j]))

print(s.check()) # is this satisfiable?
model=s.model()
result=''

# Alas the model isn't in order, so we sort it using the name
for d in sorted(model.decls(),key=getIndex):
    result=result+chr(model[d].as_long())
print(result)
```

Nulla accumsan vulputate pellentesque. Vestibulum nisi magna, accumsan eu erat sed, pretium feugiat `inline code` risus. Vestibulum quis lectus massa. Sed in ultrices turpis. Etiam mollis pretium purus, in tincidunt velit convallis ut. In ac mi in tortor varius facilisis. Aliquam consequat lacus sed tortor convallis 

![612x384.jpg](Mock%20Article%201931896d948d8024b8a6cc221aada06f/612x384.jpg)

612x384.jpg

Vestibulum quis lectus massa. Sed in ultrices turpis. Etiam mollis pretium purus, in tincidunt velit convallis ut. In ac mi in tortor varius facilisis. Aliquam consequat lacus sed tortor convallis lacinia. Etiam feugiat molestie ligula, id tincidunt ante aliquet nec. Integer tincidunt imperdiet aliquam. Pellentesque placerat sagittis ante nec placerat. Ut risus sem, ornare at urna sed, dictum faucibus velit.

> Nulla accumsan vulputate pellentesque. Vestibulum nisi magna, accumsan eu erat sed, pretium feugiat risus. Vestibulum quis lectus massa. Sed in ultrices turpis. Etiam mollis pretium purus, in tincidunt velit convallis ut.
> 

Vestibulum quis lectus massa. Sed in ultrices turpis. Etiam mollis pretium purus, in tincidunt velit convallis ut. In ac mi in tortor varius facilisis. Aliquam consequat lacus sed tortor convallis lacinia. Etiam feugiat molestie ligula, id tincidunt ante aliquet nec. Integer tincidunt imperdiet aliquam. Pellentesque placerat sagittis ante nec placerat. Ut risus sem, ornare at urna sed, dictum faucibus velit.

---

![1920x1280.jpg](Mock%20Article%201931896d948d8024b8a6cc221aada06f/1920x1280.jpg)

1920x1280.jpg

> Nulla accumsan vulputate pellentesque. Vestibulum nisi magna, accumsan eu erat sed, pretium feugiat risus. Vestibulum quis lectus massa. Sed in ultrices turpis. Etiam mollis pretium purus, in tincidunt velit convallis ut.
> 

---

## Heading 2: c

accumsan vulputate pellentesque. Vestibulum nisi magna, accumsan eu erat sed, pretium feugiat risus

```sql
WITH AfterNum AS (
    SELECT
        num AS num1,
        LEAD(num,1) OVER() num2,
        LEAD(num,2) OVER() num3
    FROM Logs
)
SELECT num1 ConsecutiveNums
FROM AfterNum
WHERE (num1=num2) AND (num2=num3)
GROUP BY num1
```

```sql
-- Output
| id | num1 | num2 | num3 |
| -- | ---- | ---- | ---- |
| 1  | 1    | 1    | 1    |
| 2  | 1    | 1    | 2    |
| 3  | 1    | 2    | 1    |
| 4  | 2    | 1    | 2    |
| 5  | 1    | 2    | 2    |
| 6  | 2    | 2    | null |
| 7  | 2    | null | null |
```

accumsan vulputate pellentesque. Vestibulum nisi magna, accumsan eu erat sed, pretium feugiat risus