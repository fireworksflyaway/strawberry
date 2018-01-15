/**
 * Created by Mason Jackson in Office on 1/8/18.
 */
//polyfill for IE11
if(String.prototype.startsWith===undefined)
{
        String.prototype.startsWith=function(str){
                if(str==null||str==""||this.length==0||str.length>this.length)
                        return false;
                if(this.substr(0,str.length)==str)
                        return true;
                else
                        return false;
                return true;
        }
}