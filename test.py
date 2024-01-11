url = 'user#234'

splittag = url.split('#')
print(splittag, splittag[0], splittag[1])

if(splittag[0]=='user' and int(splittag[1])>0):
    print ('ok!')