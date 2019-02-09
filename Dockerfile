FROM node:lts
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN yarn config set registry 'http://npmreg.mirrors.ustc.edu.cn/'


WORKDIR /app
CMD /bin/bash