'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import FormField from './FormField';
import { useRouter } from 'next/navigation';

const authFormSchema = (type: FormType) => {
  return z.object({
    username:
      type === 'sign-up'
        ? z.string().min(2).max(32)
        : z.string().min(2).max(32).optional(),
    email: z.string().email(),
    password: z.string().min(8).max(32),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        toast.success(
          'Account created successfully, please sign in.'
        );
        router.push('/sign-in');
        console.log('SIGN UP', values);
      } else {
        toast.success('Signed in successfully.');
        router.push('/');
        console.log('SIGN IN', values);
      }
    } catch (error) {
      console.error(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className='card-border lg:min-w-[566px]'>
      <div className='flex flex-col gap-6 card py-14 px-10'>
        <div className='flex flex-row gap-2 justify-center'>
          <Image
            src='/logo.svg'
            alt='logo'
            height={32}
            width={38}
          />
          <h2 className='text-primary-100'>PrepWise</h2>
        </div>
        <h3>Practice job inteviews with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-6 mt-4 form'
          >
            {!isSignIn && (
              <FormField
                name='username'
                control={form.control}
                label='Name'
                placeholder='Your Name'
              />
            )}
            <FormField
              name='email'
              control={form.control}
              label='Email'
              placeholder='Your Email'
              type='email'
            />
            <FormField
              name='password'
              control={form.control}
              label='Password'
              placeholder='Your Password'
              type='password'
            />
            <Button className='btn' type='submit'>
              {!isSignIn ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Form>
        <p className='text-center'>
          {isSignIn
            ? 'No account yet?'
            : 'Have an account already'}
          <Link
            href={!isSignIn ? '/sign-in' : '/sign-up'}
            className='font-bold text-user-primary ml-1'
          >
            {!isSignIn ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
