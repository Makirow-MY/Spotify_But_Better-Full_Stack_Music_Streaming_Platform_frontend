import AuthForm from "@/components/AuthForm";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";

const SignUp = () => {
    return <>
    
      <form className="auth-form">
        <h1 className="form-title">
        Sign Up
        </h1>
    
          <FormField
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Full Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
       

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>

              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
         <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Password</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>

              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="form-submit-button"
          //disabled={isLoading}
        >
           sign Up
        </Button>

        {
       // errorMessage && <p className="error-message">*{errorMessage}</p>
        }

        <div className="body-2 flex justify-center">
          <p className="text-light-100">
           "Already have an account?
          </p>
         
        </div>
      </form>
    

  
  </>
}

export default SignUp;
